'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TournamentPairing({ tournament, isAdmin }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showManualPairing, setShowManualPairing] = useState(false);

  const handleGeneratePairings = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/tournaments/generate-pairings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tournamentId: tournament._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Failed to generate pairings');
        return;
      }

      setMessage('Pairings generated successfully');
      router.refresh();
    } catch (err) {
      setMessage('An error occurred while generating pairings');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin || tournament.status !== 'upcoming') {
    return null;
  }

  if (tournament.matches && tournament.matches.length > 0) {
    return null; // Pairings already exist
  }

  const isPowerOf2 = (n) => n > 0 && (n & (n - 1)) === 0;
  const canGeneratePairings = tournament.participants.length > 0 && isPowerOf2(tournament.participants.length);

  return (
    <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-whisky-900 mb-4 border-b-2 border-whisky-300 pb-2">
        Tournament Pairing
      </h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${
          message.includes('success')
            ? 'bg-green-50 text-green-700 border border-green-400'
            : 'bg-red-50 text-red-700 border border-red-400'
        }`}>
          {message}
        </div>
      )}

      {!canGeneratePairings && tournament.participants.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 border border-yellow-400 rounded">
          <p className="text-sm">
            Number of participants ({tournament.participants.length}) must be a power of 2 (2, 4, 8, 16, etc.) to generate pairings.
          </p>
        </div>
      )}

      {tournament.participants.length === 0 ? (
        <p className="text-whisky-700 mb-4">No participants registered yet. Participants can register on the home page.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4">
            <button
              onClick={handleGeneratePairings}
              disabled={loading || !canGeneratePairings}
              className="w-full sm:w-auto px-4 py-2 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Pairings (Auto)'}
            </button>
            <button
              onClick={() => setShowManualPairing(!showManualPairing)}
              disabled={!canGeneratePairings}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showManualPairing ? 'Cancel Manual Pairing' : 'Manual Pairing'}
            </button>
          </div>

          {showManualPairing && canGeneratePairings && (
            <ManualPairingForm 
              tournament={tournament} 
              onSave={() => {
                setShowManualPairing(false);
                router.refresh();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ManualPairingForm({ tournament, onSave }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Calculate number of rounds and matches needed
  const numParticipants = tournament.participants.length;
  const rounds = Math.ceil(Math.log2(numParticipants));
  const bracketSize = Math.pow(2, rounds);
  const firstRoundMatches = bracketSize / 2;

  // Initialize matches structure - only first round for manual pairing
  const [matches, setMatches] = useState(() => {
    const initialMatches = [];
    
    // First round only - subsequent rounds will be auto-generated when matches complete
    for (let i = 0; i < firstRoundMatches; i++) {
      initialMatches.push({
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

    return initialMatches;
  });

  const handlePlayerChange = (matchIndex, slot, playerId) => {
    const newMatches = [...matches];
    if (slot === 'player1') {
      newMatches[matchIndex].player1 = playerId || null;
    } else {
      newMatches[matchIndex].player2 = playerId || null;
    }
    setMatches(newMatches);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    // Generate full bracket structure from first round matches
    const fullMatches = generateFullBracketFromFirstRound(matches, rounds);

    try {
      const response = await fetch('/api/tournaments/manual-pairing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tournamentId: tournament._id,
          matches: fullMatches,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Failed to save pairings');
        return;
      }

      setMessage('Pairings saved successfully');
      setTimeout(() => {
        onSave();
      }, 1000);
    } catch (err) {
      setMessage('An error occurred while saving pairings');
    } finally {
      setLoading(false);
    }
  };

  // Generate full bracket structure from first round
  const generateFullBracketFromFirstRound = (firstRoundMatches, totalRounds) => {
    const allMatches = [...firstRoundMatches];
    
    // Generate subsequent rounds
    let currentRoundMatches = firstRoundMatches.length;
    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = currentRoundMatches / 2;
      for (let i = 0; i < matchesInRound; i++) {
        allMatches.push({
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

    return allMatches;
  };

  const firstRoundMatchesList = matches.filter(m => m.round === 1);

  return (
    <div className="mt-4 p-4 bg-white border-2 border-whisky-300 rounded-lg">
      <h3 className="text-lg font-semibold text-whisky-900 mb-4">Manual Pairing - Round 1</h3>
      
      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${
          message.includes('success')
            ? 'bg-green-50 text-green-700 border border-green-400'
            : 'bg-red-50 text-red-700 border border-red-400'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {firstRoundMatchesList.map((match, index) => {
          const matchIndex = matches.indexOf(match);
          return (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4 p-3 bg-whisky-50 rounded border border-whisky-300">
              <span className="font-medium text-whisky-800 sm:w-20">Match {match.matchNumber}:</span>
              
              <select
                value={match.player1 || ''}
                onChange={(e) => handlePlayerChange(matchIndex, 'player1', e.target.value)}
                className="flex-1 px-3 py-2 border border-whisky-300 rounded-md bg-white text-sm sm:text-base"
              >
                <option value="">Select Player 1</option>
                {tournament.participants.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.firstName} {p.lastName}
                    {p.manualRating && ` (${p.manualRating})`}
                    {p.chessComData?.rapid && ` [Rapid: ${p.chessComData.rapid}]`}
                  </option>
                ))}
              </select>

              <span className="text-whisky-700 font-medium text-center sm:text-left">vs</span>

              <select
                value={match.player2 || ''}
                onChange={(e) => handlePlayerChange(matchIndex, 'player2', e.target.value)}
                className="flex-1 px-3 py-2 border border-whisky-300 rounded-md bg-white text-sm sm:text-base"
              >
                <option value="">Select Player 2</option>
                {tournament.participants.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.firstName} {p.lastName}
                    {p.manualRating && ` (${p.manualRating})`}
                    {p.chessComData?.rapid && ` [Rapid: ${p.chessComData.rapid}]`}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Saving...' : 'Save Pairings'}
        </button>
      </div>
    </div>
  );
}

