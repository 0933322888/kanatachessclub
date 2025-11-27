import connectDB from './mongodb';
import User from '../models/User';

export async function fetchChessComProfile(username) {
  try {
    const response = await fetch(`https://api.chess.com/pub/player/${username}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Chess.com username not found');
      }
      throw new Error('Failed to fetch Chess.com profile');
    }

    const profile = await response.json();
    return profile;
  } catch (error) {
    throw error;
  }
}

export async function fetchChessComStats(username) {
  try {
    const response = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Chess.com stats not found');
      }
      throw new Error('Failed to fetch Chess.com stats');
    }

    const stats = await response.json();
    return stats;
  } catch (error) {
    throw error;
  }
}

export async function syncChessComData(userId, username) {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if we need to refresh (24 hours)
  const now = new Date();
  const lastSynced = user.chessComData?.lastSynced;
  const shouldRefresh = !lastSynced || (now - new Date(lastSynced)) > 24 * 60 * 60 * 1000;

  if (!shouldRefresh && user.chessComData?.username === username) {
    return {
      username: user.chessComData.username,
      avatar: user.chessComData.avatar,
      rapid: user.chessComData.rapid,
      blitz: user.chessComData.blitz,
      bullet: user.chessComData.bullet,
      lastSynced: user.chessComData.lastSynced,
    };
  }

  try {
    const [profile, stats] = await Promise.all([
      fetchChessComProfile(username),
      fetchChessComStats(username),
    ]);

    const chessComData = {
      username: profile.username,
      avatar: profile.avatar || null,
      rapid: stats.chess_rapid?.last?.rating || null,
      blitz: stats.chess_blitz?.last?.rating || null,
      bullet: stats.chess_bullet?.last?.rating || null,
      lastSynced: now,
    };

    user.chessComData = chessComData;
    user.chessComUsername = username;
    await user.save();

    return chessComData;
  } catch (error) {
    throw error;
  }
}

