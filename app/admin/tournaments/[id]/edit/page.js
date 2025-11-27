import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import connectDB from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import Tournament from '../../../../../models/Tournament';
import EditTournamentClient from '../../../../../components/EditTournamentClient';
import { serializeTournament } from '../../../../../lib/serialize';

export default async function EditTournamentPage({ params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/');
  }

  await connectDB();
  
  const tournament = await Tournament.findById(params.id)
    .populate('participants', 'firstName lastName');
  
  if (!tournament) {
    redirect('/tournaments');
  }

  // Only allow editing if tournament hasn't started
  if (tournament.status !== 'upcoming') {
    redirect(`/tournaments/${params.id}`);
  }

  const users = await User.find().select('firstName lastName').sort({ lastName: 1, firstName: 1 });

  return (
    <EditTournamentClient 
      users={JSON.parse(JSON.stringify(users))} 
      tournament={serializeTournament(tournament)}
    />
  );
}

