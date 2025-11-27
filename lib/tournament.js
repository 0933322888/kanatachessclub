// Tournament bracket generation utilities

/**
 * Get the highest available rating for a user
 * Priority: manualRating > chessComData.rapid > chessComData.blitz > chessComData.bullet
 */
export function getUserRating(user) {
  if (!user) return 0;
  
  // If user is just an ID string, return 0 (will be populated later)
  if (typeof user === 'string') return 0;
  
  // Prefer manual rating
  if (user.manualRating && user.manualRating > 0) {
    return user.manualRating;
  }
  
  // Fall back to chess.com ratings
  if (user.chessComData) {
    if (user.chessComData.rapid && user.chessComData.rapid > 0) {
      return user.chessComData.rapid;
    }
    if (user.chessComData.blitz && user.chessComData.blitz > 0) {
      return user.chessComData.blitz;
    }
    if (user.chessComData.bullet && user.chessComData.bullet > 0) {
      return user.chessComData.bullet;
    }
  }
  
  return 0;
}

/**
 * Sort participants by their highest available rating (descending)
 */
export function sortParticipantsByRating(participants) {
  return [...participants].sort((a, b) => {
    const ratingA = getUserRating(a);
    const ratingB = getUserRating(b);
    return ratingB - ratingA; // Descending order (highest first)
  });
}

export function generateSingleEliminationBracket(participants) {
  // Sort participants by rating before generating bracket
  const sortedParticipants = sortParticipantsByRating(participants);
  const numParticipants = participants.length;
  const rounds = Math.ceil(Math.log2(numParticipants));
  const bracketSize = Math.pow(2, rounds);
  
  const matches = [];
  let matchId = 0;
  
  // Generate first round matches
  // Pair highest rated with second highest, third with fourth, etc.
  for (let i = 0; i < bracketSize / 2; i++) {
    // Extract user ID from user object (if it's an object) or use the ID directly
    const player1Id = i * 2 < numParticipants 
      ? (typeof sortedParticipants[i * 2] === 'object' ? sortedParticipants[i * 2]._id : sortedParticipants[i * 2])
      : null;
    const player2Id = i * 2 + 1 < numParticipants 
      ? (typeof sortedParticipants[i * 2 + 1] === 'object' ? sortedParticipants[i * 2 + 1]._id : sortedParticipants[i * 2 + 1])
      : null;
    
    matches.push({
      round: 1,
      matchNumber: i + 1,
      player1: player1Id,
      player2: player2Id,
      winner: null,
      score1: null,
      score2: null,
      completed: false,
      nextMatch: null,
      nextMatchSlot: null,
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
        nextMatch: null,
        nextMatchSlot: null,
      });
    }
    currentRoundMatches = matchesInRound;
  }
  
  // Link matches
  let matchIndex = 0;
  for (let round = 1; round < rounds; round++) {
    const matchesInRound = Math.pow(2, rounds - round);
    const nextRoundStart = matchIndex + matchesInRound;
    
    for (let i = 0; i < matchesInRound; i++) {
      const currentMatch = matches[matchIndex + i];
      const nextRoundMatchIndex = nextRoundStart + Math.floor(i / 2);
      const nextMatch = matches[nextRoundMatchIndex];
      
      if (i % 2 === 0) {
        nextMatch.player1 = null; // Will be set when current match completes
      } else {
        nextMatch.player2 = null; // Will be set when current match completes
      }
    }
    
    matchIndex += matchesInRound;
  }
  
  return matches;
}

/**
 * Generate empty bracket structure (without participants assigned)
 * Used to display bracket before pairings are done
 */
export function generateEmptyBracket(numParticipants, type = 'single') {
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
      nextMatch: null,
      nextMatchSlot: null,
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
        nextMatch: null,
        nextMatchSlot: null,
      });
    }
    currentRoundMatches = matchesInRound;
  }
  
  // Link matches
  let matchIndex = 0;
  for (let round = 1; round < rounds; round++) {
    const matchesInRound = Math.pow(2, rounds - round);
    const nextRoundStart = matchIndex + matchesInRound;
    
    for (let i = 0; i < matchesInRound; i++) {
      const currentMatch = matches[matchIndex + i];
      const nextRoundMatchIndex = nextRoundStart + Math.floor(i / 2);
      const nextMatch = matches[nextRoundMatchIndex];
      
      if (i % 2 === 0) {
        nextMatch.player1 = null; // Will be set when current match completes
      } else {
        nextMatch.player2 = null; // Will be set when current match completes
      }
    }
    
    matchIndex += matchesInRound;
  }
  
  return matches;
}

export function generateDoubleEliminationBracket(participants) {
  // Simplified double elimination - using single elimination structure
  // In a full implementation, this would include a losers bracket
  // For now, we'll use a similar structure but mark it as double elimination
  // Note: generateSingleEliminationBracket already sorts by rating
  const winnersBracket = generateSingleEliminationBracket(participants);
  
  // Add losers bracket matches (simplified)
  const losersBracket = [];
  const rounds = Math.ceil(Math.log2(participants.length));
  
  // Generate losers bracket (simplified version)
  for (let round = 1; round < rounds; round++) {
    const matchesInRound = Math.pow(2, rounds - round - 1);
    for (let i = 0; i < matchesInRound; i++) {
      losersBracket.push({
        round: round,
        matchNumber: i + 1,
        bracket: 'losers',
        player1: null,
        player2: null,
        winner: null,
        score1: null,
        score2: null,
        completed: false,
      });
    }
  }
  
  return {
    winners: winnersBracket,
    losers: losersBracket,
  };
}

export function getNextRoundMatches(tournament, completedMatchId) {
  // Find the completed match
  const completedMatch = tournament.matches.find(
    m => m._id.toString() === completedMatchId.toString()
  );
  
  if (!completedMatch || !completedMatch.completed) {
    return [];
  }
  
  // Find matches in the next round that need players
  const nextRound = completedMatch.round + 1;
  const nextRoundMatches = tournament.matches.filter(
    m => m.round === nextRound
  );
  
  // Determine which slot in the next match this winner should go to
  const matchNumber = completedMatch.matchNumber;
  const nextMatchNumber = Math.ceil(matchNumber / 2);
  const nextMatch = nextRoundMatches.find(m => m.matchNumber === nextMatchNumber);
  
  if (nextMatch) {
    const isFirstMatch = matchNumber % 2 === 1;
    if (isFirstMatch) {
      nextMatch.player1 = completedMatch.winner;
    } else {
      nextMatch.player2 = completedMatch.winner;
    }
  }
  
  return nextRoundMatches;
}

