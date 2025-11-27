/**
 * Properly serialize MongoDB documents to plain objects
 * Converts ObjectIds to strings and handles nested objects
 */
export function serializeTournament(tournament) {
  if (!tournament) return null;

  // Convert Mongoose document to plain object if needed
  const plainTournament = tournament.toObject ? tournament.toObject() : tournament;

  const serialized = {
    _id: plainTournament._id?.toString() || plainTournament._id,
    name: plainTournament.name,
    type: plainTournament.type,
    status: plainTournament.status,
    participants: plainTournament.participants?.map(p => {
      if (typeof p === 'object' && p !== null) {
        return {
          _id: p._id?.toString() || p._id,
          firstName: p.firstName,
          lastName: p.lastName,
          chessComData: p.chessComData ? {
            username: p.chessComData.username,
            avatar: p.chessComData.avatar,
            rapid: p.chessComData.rapid,
            blitz: p.chessComData.blitz,
            bullet: p.chessComData.bullet,
            lastSynced: p.chessComData.lastSynced,
          } : null,
          manualRating: p.manualRating,
        };
      }
      return p?.toString() || p;
    }) || [],
    matches: plainTournament.matches?.map(m => ({
      _id: m._id?.toString() || m._id,
      round: m.round,
      matchNumber: m.matchNumber,
      player1: m.player1 ? (typeof m.player1 === 'object' ? {
        _id: m.player1._id?.toString() || m.player1._id,
        firstName: m.player1.firstName,
        lastName: m.player1.lastName,
      } : m.player1?.toString() || m.player1) : null,
      player2: m.player2 ? (typeof m.player2 === 'object' ? {
        _id: m.player2._id?.toString() || m.player2._id,
        firstName: m.player2.firstName,
        lastName: m.player2.lastName,
      } : m.player2?.toString() || m.player2) : null,
      winner: m.winner ? (typeof m.winner === 'object' ? {
        _id: m.winner._id?.toString() || m.winner._id,
        firstName: m.winner.firstName,
        lastName: m.winner.lastName,
      } : m.winner?.toString() || m.winner) : null,
      score1: m.score1,
      score2: m.score2,
      completed: m.completed,
      nextMatch: m.nextMatch?.toString() || m.nextMatch,
      nextMatchSlot: m.nextMatchSlot,
    })) || [],
    winner: plainTournament.winner ? (typeof plainTournament.winner === 'object' ? {
      _id: plainTournament.winner._id?.toString() || plainTournament.winner._id,
      firstName: plainTournament.winner.firstName,
      lastName: plainTournament.winner.lastName,
    } : plainTournament.winner?.toString() || plainTournament.winner) : null,
    createdBy: plainTournament.createdBy ? (typeof plainTournament.createdBy === 'object' ? {
      _id: plainTournament.createdBy._id?.toString() || plainTournament.createdBy._id,
      firstName: plainTournament.createdBy.firstName,
      lastName: plainTournament.createdBy.lastName,
    } : plainTournament.createdBy?.toString() || plainTournament.createdBy) : null,
    createdAt: plainTournament.createdAt,
    startedAt: plainTournament.startedAt,
    completedAt: plainTournament.completedAt,
    eventDate: plainTournament.eventDate,
    gameTimeDuration: plainTournament.gameTimeDuration,
    adminComment: plainTournament.adminComment,
  };

  return serialized;
}

