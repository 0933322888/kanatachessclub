import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import OpponentRequest from '../../models/OpponentRequest';
import { getNextGatheringDate, formatDate } from '../../lib/utils';
import NextGatheringClient from '../../components/NextGatheringClient';

export default async function NextGatheringPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  await connectDB();
  const nextGathering = getNextGatheringDate();

  // Get current user's full data for attendees list
  const currentUser = await User.findById(session.user.id).select('firstName lastName chessComData manualRating preferredStrength attendingNextGathering');

  // Get all users attending (including current user if they marked attendance)
  const attendees = await User.find({
    attendingNextGathering: true,
  })
    .select('_id firstName lastName chessComData manualRating preferredStrength')
    .sort({ lastName: 1, firstName: 1 })
    .lean();
  
  // Debug: log attendees count
  console.log(`Found ${attendees.length} attendees for next gathering`);
  if (attendees.length > 0) {
    console.log('Attendees:', attendees.map(a => `${a.firstName} ${a.lastName} (${a._id})`));
  }


  // Get opponent requests for current user
  const myRequests = await OpponentRequest.find({
    $or: [
      { requester: session.user.id, gatheringDate: nextGathering },
      { requested: session.user.id, gatheringDate: nextGathering },
    ],
  }).populate('requester', 'firstName lastName').populate('requested', 'firstName lastName');

  // Get matched pairs
  const matchedPairs = await OpponentRequest.find({
    gatheringDate: nextGathering,
    status: 'accepted',
  }).populate('requester', 'firstName lastName').populate('requested', 'firstName lastName');

  // Gathering location (can be made configurable later)
  const gatheringLocation = process.env.GATHERING_LOCATION || 'Kanata Community Centre, 100 John Anson Lane, Kanata, ON';
  
  // Gathering time
  const gatheringTime = process.env.GATHERING_TIME || '7pm - 9pm';
  
  // Gathering coordinates
  const gatheringCoordinates = {
    latitude: parseFloat(process.env.GATHERING_LATITUDE || '45.29691918721957'),
    longitude: parseFloat(process.env.GATHERING_LONGITUDE || '-75.9389548581184'),
  };

  return (
    <NextGatheringClient
      nextGathering={nextGathering.toISOString()}
      gatheringLocation={gatheringLocation}
      gatheringTime={gatheringTime}
      gatheringCoordinates={gatheringCoordinates}
      isAttending={currentUser?.attendingNextGathering || false}
      attendees={JSON.parse(JSON.stringify(attendees))}
      myRequests={JSON.parse(JSON.stringify(myRequests))}
      matchedPairs={JSON.parse(JSON.stringify(matchedPairs))}
      currentUserId={session.user.id}
      currentUser={JSON.parse(JSON.stringify(currentUser))}
    />
  );
}

