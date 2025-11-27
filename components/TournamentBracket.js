'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TournamentBracket({ tournament, isAdmin }) {
  const router = useRouter();
  const [loading, setLoading] = useState({});
  const [message, setMessage] = useState('');

  // Generate empty bracket structure if matches don't exist
  const bracketMatches = useMemo(() => {
    if (tournament.matches && tournament.matches.length > 0) {
      return tournament.matches;
    }
    
    // Generate empty bracket structure
    const numParticipants = tournament.participants?.length || 0;
    if (numParticipants === 0) {
      return [];
    }
    
    const isPowerOf2 = (n) => n > 0 && (n & (n - 1)) === 0;
    if (!isPowerOf2(numParticipants)) {
      return []; // Can't generate bracket if not power of 2
    }
    
    const rounds = Math.ceil(Math.log2(numParticipants));
    const bracketSize = Math.pow(2, rounds);
    const matches = [];
    
    // Generate first round matches (all empty)
    for (let i = 0; i < bracketSize / 2; i++) {
      matches.push({
        round: 1,
        matchNumber: i + 1,
        player1: null,
        player2: null,
        winner: null,
        score1: null,
        score2: null,
        completed: false,
      });
    }
    
    // Generate subsequent rounds
    let currentRoundMatches = bracketSize / 2;
    for (let round = 2; round <= rounds; round++) {
      const matchesInRound = currentRoundMatches / 2;
      for (let i = 0; i < matchesInRound; i++) {
        matches.push({
          round: round,
          matchNumber: i + 1,
          player1: null,
          player2: null,
          winner: null,
          score1: null,
          score2: null,
          completed: false,
        });
      }
      currentRoundMatches = matchesInRound;
    }
    
    return matches;
  }, [tournament.matches, tournament.participants]);

  const handleUpdateMatch = async (matchId, score1, score2, winnerId) => {
    setLoading({ ...loading, [matchId]: true });
    setMessage('');

    try {
      const response = await fetch('/api/tournaments/update-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tournamentId: tournament._id,
          matchId,
          score1: parseInt(score1),
          score2: parseInt(score2),
          winnerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Update failed');
        return;
      }

      setMessage('Match updated successfully');
      router.refresh();
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setLoading({ ...loading, [matchId]: false });
    }
  };

  const getMaxRound = () => {
    if (!bracketMatches || bracketMatches.length === 0) return 0;
    return Math.max(...bracketMatches.map(m => m.round));
  };

  const getMatchesByRound = (round) => {
    if (!bracketMatches) return [];
    return bracketMatches.filter(m => m.round === round);
  };

  const maxRound = getMaxRound();

  // Only show bracket if we have participants and it's a valid bracket size
  const numParticipants = tournament.participants?.length || 0;
  const isPowerOf2 = (n) => n > 0 && (n & (n - 1)) === 0;
  
  if (maxRound === 0 || numParticipants === 0 || !isPowerOf2(numParticipants)) {
    return null;
  }

  return (
    <div>
      {message && (
        <div className={`mb-4 p-4 rounded-lg shadow-md border-2 ${
          message.includes('success')
            ? 'bg-whisky-100 text-whisky-800 border-amber'
            : 'bg-burgundy-light text-white border-burgundy'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-whisky-900 mb-4 border-b-2 border-whisky-300 pb-2">Participants</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tournament.participants.map((participant) => (
            <Link
              key={participant._id}
              href={`/users/${participant._id}`}
              className="border-2 border-whisky-300 rounded-lg p-2 bg-white hover:border-amber hover:shadow-md transition-all"
            >
              <p className="font-medium text-whisky-900 hover:text-amber transition-colors">{participant.firstName} {participant.lastName}</p>
              {participant.chessComData?.rapid && (
                <p className="text-xs text-whisky-600">Rapid: {participant.chessComData.rapid}</p>
              )}
              {participant.manualRating && (
                <p className="text-xs text-whisky-600">Rating: {participant.manualRating}</p>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold text-whisky-900 mb-4 border-b-2 border-whisky-300 pb-2">Bracket</h2>
        <div className="flex gap-8 min-w-max">
          {Array.from({ length: maxRound }, (_, i) => i + 1).map((round) => (
            <div key={round} className="flex flex-col gap-4 min-w-[200px]">
              <h3 className="font-semibold text-whisky-800 text-center mb-2">
                Round {round}
                {round === maxRound && ' (Final)'}
              </h3>
              {getMatchesByRound(round).map((match, index) => (
                <MatchCard
                  key={match._id || `match-${round}-${match.matchNumber}-${index}`}
                  match={match}
                  isAdmin={isAdmin}
                  onUpdate={handleUpdateMatch}
                  loading={loading[match._id]}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match, isAdmin, onUpdate, loading }) {
  const [score1, setScore1] = useState(match.score1?.toString() || '');
  const [score2, setScore2] = useState(match.score2?.toString() || '');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!score1 || !score2) return;
    
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    
    if (s1 === s2) {
      alert('Scores cannot be equal');
      return;
    }

    const winnerId = s1 > s2 ? match.player1?._id : match.player2?._id;
    if (match._id) {
      onUpdate(match._id, s1, s2, winnerId);
      setShowForm(false);
    }
  };

  return (
    <div className="border-2 border-whisky-300 rounded-lg p-3 bg-whisky-50">
      <div className="space-y-2">
        <div className={`p-2 rounded ${match.player1 ? 'bg-white border border-whisky-200' : 'bg-whisky-100'}`}>
          {match.player1 ? (
            typeof match.player1 === 'object' && match.player1.firstName ? (
              <Link
                href={`/users/${match.player1._id}`}
                className="font-medium text-whisky-900 hover:text-amber transition-colors"
              >
                {match.player1.firstName} {match.player1.lastName}
              </Link>
            ) : (
              <p className="text-whisky-600 text-sm">Player 1</p>
            )
          ) : (
            <p className="text-whisky-400 text-sm">TBD</p>
          )}
        </div>
        <div className="text-center text-sm text-whisky-700">vs</div>
        <div className={`p-2 rounded ${match.player2 ? 'bg-white border border-whisky-200' : 'bg-whisky-100'}`}>
          {match.player2 ? (
            typeof match.player2 === 'object' && match.player2.firstName ? (
              <Link
                href={`/users/${match.player2._id}`}
                className="font-medium text-whisky-900 hover:text-amber transition-colors"
              >
                {match.player2.firstName} {match.player2.lastName}
              </Link>
            ) : (
              <p className="text-whisky-600 text-sm">Player 2</p>
            )
          ) : (
            <p className="text-whisky-400 text-sm">TBD</p>
          )}
        </div>
      </div>

      {match.completed && (
        <div className="mt-2 pt-2 border-t-2 border-whisky-300">
          <p className="text-sm text-whisky-700">
            Score: {match.score1} - {match.score2}
          </p>
          {match.winner && (
            <p className="text-sm font-medium text-amber">
              Winner:{' '}
              <Link
                href={`/users/${match.winner._id}`}
                className="hover:text-amber-dark transition-colors"
              >
                {match.winner.firstName} {match.winner.lastName}
              </Link>
            </p>
          )}
        </div>
      )}

      {isAdmin && match._id && match.player1 && match.player2 && !match.completed && (
        <div className="mt-2">
            {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full px-3 py-1 text-sm bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium"
            >
              Enter Result
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={score1}
                  onChange={(e) => setScore1(e.target.value)}
                  placeholder="Score 1"
                  className="w-full px-2 py-1 text-sm border-2 border-whisky-300 rounded-md bg-white text-whisky-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
                  required
                />
                <input
                  type="number"
                  value={score2}
                  onChange={(e) => setScore2(e.target.value)}
                  placeholder="Score 2"
                  className="w-full px-2 py-1 text-sm border-2 border-whisky-300 rounded-md bg-white text-whisky-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-3 py-1 text-sm bg-amber text-white rounded-md hover:bg-amber-dark shadow-md disabled:opacity-50 transition-colors font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setScore1(match.score1?.toString() || '');
                    setScore2(match.score2?.toString() || '');
                  }}
                  className="flex-1 px-3 py-1 text-sm bg-whisky-200 text-whisky-800 rounded-md hover:bg-whisky-300 border-2 border-whisky-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

