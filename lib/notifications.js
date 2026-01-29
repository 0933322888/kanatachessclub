import connectDB from './mongodb';
import Notification from '../models/Notification';

/**
 * Create a notification for a user
 * @param {string} userId - User ID to notify
 * @param {string} type - Notification type
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} link - Optional link to navigate to
 * @param {string} tournamentId - Optional tournament ID
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  link = null,
  tournamentId = null,
  clubId = null,
}) {
  try {
    await connectDB();

    const currentClubId = clubId || process.env.NEXT_PUBLIC_CLUB_ID || 'kanata';

    const notification = new Notification({
      user: userId,
      type,
      title,
      message,
      link,
      tournament: tournamentId,
      clubId: currentClubId,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Create notifications for multiple users
 * @param {Array<string>} userIds - Array of user IDs
 * @param {Object} notificationData - Notification data (type, title, message, link, tournament, clubId)
 */
export async function createNotificationsForUsers(userIds, notificationData) {
  try {
    await connectDB();

    const currentClubId = notificationData.clubId || process.env.NEXT_PUBLIC_CLUB_ID || 'kanata';

    const notifications = userIds.map((userId) => ({
      user: userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      link: notificationData.link || null,
      tournament: notificationData.tournament || null,
      clubId: currentClubId,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

  } catch (error) {
    console.error('Error creating notifications for users:', error);
    throw error;
  }
}

