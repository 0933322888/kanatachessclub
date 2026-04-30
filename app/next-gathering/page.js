import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import OpponentRequest from '../../models/OpponentRequest';
import { getNextGatheringDate } from '../../lib/gatherings';
import NextGatheringClient from '../../components/NextGatheringClient';
import { getSiteConfig } from '../../lib/site-config';

export async function generateMetadata() {
  const { name } = getSiteConfig();
  return {
    title: `Next Gathering | ${name}`,
    description: `Join us for the next gathering of ${name}. Check attendees, request opponents, and see location details.`,
  };
}

export default async function NextGatheringPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  const { name, location, address, gatheringTime, coordinates, googleMapsUrl } = getSiteConfig();
  const currentClubId = process.env.NEXT_PUBLIC_CLUB_ID || 'kanata';

  await connectDB();
  const nextGathering = await getNextGatheringDate();
  const nextGatheringStart = new Date(nextGathering);
  nextGatheringStart.setHours(0, 0, 0, 0);

  // Get current user's full data for attendees list
  const currentUser = await User.findById(session.user.id).select('firstName lastName chessComData manualRating preferredStrength attendingNextGathering attendingGatheringDate');
  const isCurrentUserAttending = Boolean(
    currentUser?.attendingNextGathering &&
    currentUser?.attendingGatheringDate &&
    new Date(currentUser.attendingGatheringDate).getTime() === nextGatheringStart.getTime()
  );

  // Get all users attending who are members of this club
  const attendees = await User.find({
    attendingNextGathering: true,
    attendingGatheringDate: nextGatheringStart,
    clubs: currentClubId,
  })
    .select('_id firstName lastName chessComData manualRating preferredStrength')
    .sort({ lastName: 1, firstName: 1 })
    .lean();

  // Get opponent requests for current user at this club
  const myRequests = await OpponentRequest.find({
    clubId: currentClubId,
    $or: [
      { requester: session.user.id, gatheringDate: nextGathering },
      { requested: session.user.id, gatheringDate: nextGathering },
    ],
  }).populate('requester', 'firstName lastName').populate('requested', 'firstName lastName');

  // Get matched pairs at this club
  const matchedPairs = await OpponentRequest.find({
    clubId: currentClubId,
    gatheringDate: nextGathering,
    status: 'accepted',
  }).populate('requester', 'firstName lastName').populate('requested', 'firstName lastName');

  const gatheringLocation = `${location} (${address})`;

  return (
    <NextGatheringClient
      nextGathering={nextGathering.toISOString()}
      gatheringLocation={gatheringLocation}
      gatheringTime={gatheringTime}
      gatheringCoordinates={coordinates}
      googleMapsUrl={googleMapsUrl}
      isAttending={isCurrentUserAttending}
      attendees={JSON.parse(JSON.stringify(attendees))}
      myRequests={JSON.parse(JSON.stringify(myRequests))}
      matchedPairs={JSON.parse(JSON.stringify(matchedPairs))}
      currentUserId={session.user.id}
      currentUser={JSON.parse(JSON.stringify(currentUser))}
    />
  );
}


