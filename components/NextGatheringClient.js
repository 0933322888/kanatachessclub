'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import GatheringChat from './GatheringChat';

// Dynamically import map to avoid SSR issues
const LocationMap = dynamic(() => import('./LocationMap'), {
  ssr: false,
});

export default function NextGatheringClient({ nextGathering, gatheringLocation, gatheringTime, gatheringCoordinates, isAttending, attendees: initialAttendees, myRequests, matchedPairs, currentUserId, currentUser }) {
  const router = useRouter();
  const [loading, setLoading] = useState({});
  const [message, setMessage] = useState('');
  const [attending, setAttending] = useState(isAttending);
  const [pairings, setPairings] = useState(() => {
    // Initialize pairings from matchedPairs
    const pairs = {};
    matchedPairs.forEach(pair => {
      const id1 = pair.requester._id.toString();
      const id2 = pair.requested._id.toString();
      pairs[id1] = id2;
      pairs[id2] = id1;
    });
    return pairs;
  });
  const [attendees, setAttendees] = useState(() => {
    // Initialize with server data, and ensure current user is included if they're attending
    const attendeesList = Array.isArray(initialAttendees) ? initialAttendees : [];
    
    // Debug logging
    console.log('Initial attendees from server:', attendeesList.length);
    console.log('Current user attending status:', isAttending);
    console.log('Current user data:', currentUser);
    
    if (isAttending && currentUser && currentUser._id) {
      const userInList = attendeesList.some(a => a && a._id && a._id.toString() === currentUserId);
      if (!userInList) {
        const sorted = [...attendeesList, {
          _id: currentUser._id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          chessComData: currentUser.chessComData,
          manualRating: currentUser.manualRating,
          preferredStrength: currentUser.preferredStrength,
        }].sort((a, b) => {
          const lastNameCompare = (a.lastName || '').localeCompare(b.lastName || '');
          if (lastNameCompare !== 0) return lastNameCompare;
          return (a.firstName || '').localeCompare(b.firstName || '');
        });
        console.log('Added current user to attendees list. Total:', sorted.length);
        return sorted;
      }
    }
    console.log('Returning initial attendees list:', attendeesList.length);
    return attendeesList;
  });

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const getPlayerRating = (player) => {
    if (player.chessComData?.rapid) {
      return `Rapid: ${player.chessComData.rapid}`;
    }
    if (player.manualRating) {
      return `Rating: ${player.manualRating}`;
    }
    return 'No rating';
  };

  const renderAttendeeCard = (attendee, showPairButton = false) => {
    if (!attendee || !attendee._id) {
      return null;
    }

    const attendeeId = attendee._id.toString();
    const isCurrentUser = attendeeId === currentUserId;
    const isPaired = pairings[attendeeId];
    const hasPendingRequest = myRequests.some(
      r => (r.requester._id.toString() === currentUserId && r.requested._id.toString() === attendeeId) ||
           (r.requested._id.toString() === currentUserId && r.requester._id.toString() === attendeeId)
    );
    const hasAcceptedRequest = myRequests.some(
      r => r.status === 'accepted' && (
        (r.requester._id.toString() === currentUserId && r.requested._id.toString() === attendeeId) ||
        (r.requested._id.toString() === currentUserId && r.requester._id.toString() === attendeeId)
      )
    );

    return (
      <div
        key={attendee._id}
        className={`bg-white rounded-lg border-2 ${isPaired ? 'border-amber' : 'border-whisky-300'} p-4 flex items-center justify-between space-x-3 transition-all`}
      >
        <Link
          href={`/users/${attendee._id}`}
          className="flex items-center space-x-3 flex-1 hover:opacity-80 transition-opacity"
        >
          {attendee.chessComData?.avatar ? (
            <img
              src={attendee.chessComData.avatar}
              alt={`${attendee.firstName} ${attendee.lastName}`}
              className="w-12 h-12 rounded-full object-cover border-2 border-amber"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-whisky-600 flex items-center justify-center border-2 border-amber">
              <span className="text-sm font-semibold text-amber">
                {attendee.firstName?.charAt(0) || ''}{attendee.lastName?.charAt(0) || ''}
              </span>
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-whisky-900">
              {attendee.firstName} {attendee.lastName}
              {isCurrentUser && <span className="text-xs text-whisky-500 ml-2">(You)</span>}
            </p>
            {getPlayerRating(attendee) !== 'No rating' && (
              <p className="text-xs text-whisky-600">{getPlayerRating(attendee)}</p>
            )}
            {attendee.preferredStrength && (
              <p className="text-xs text-whisky-500">{attendee.preferredStrength}</p>
            )}
          </div>
        </Link>
        {showPairButton && !isCurrentUser && !isPaired && !hasAcceptedRequest && (
          <button
            onClick={() => handlePairWith(attendeeId)}
            disabled={loading[`pair-${attendeeId}`] || hasPendingRequest}
            className={`px-4 py-2 rounded-md shadow-md font-medium transition-colors ${
              hasPendingRequest
                ? 'bg-whisky-200 text-whisky-700 cursor-not-allowed'
                : 'bg-amber text-white hover:bg-amber-dark'
            } disabled:opacity-50`}
          >
            {loading[`pair-${attendeeId}`] ? 'Pairing...' : hasPendingRequest ? 'Request Sent' : 'Pair with'}
          </button>
        )}
        {isPaired && (
          <span className="px-3 py-1 bg-amber text-white rounded-md text-sm font-medium">
            Paired
          </span>
        )}
      </div>
    );
  };


  const handlePairWith = async (attendeeId) => {
    setLoading({ ...loading, [`pair-${attendeeId}`]: true });
    setMessage('');

    try {
      const response = await fetch('/api/opponents/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestedId: attendeeId,
          gatheringDate: nextGathering,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Pairing request failed');
        return;
      }

      setMessage('Pairing request sent!');
      router.refresh();
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setLoading({ ...loading, [`pair-${attendeeId}`]: false });
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setLoading({ ...loading, [requestId]: true });
    setMessage('');

    try {
      const response = await fetch('/api/opponents/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Accept failed');
        return;
      }

      // Update pairings state
      const request = myRequests.find(r => r._id === requestId);
      if (request) {
        const requesterId = request.requester._id.toString();
        const requestedId = request.requested._id.toString();
        setPairings(prev => ({
          ...prev,
          [requesterId]: requestedId,
          [requestedId]: requesterId,
        }));
      }

      setMessage('Request accepted! You are now paired.');
      router.refresh();
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setLoading({ ...loading, [requestId]: false });
    }
  };

  const handleRejectRequest = async (requestId) => {
    setLoading({ ...loading, [requestId]: true });
    setMessage('');

    try {
      const response = await fetch('/api/opponents/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Reject failed');
        return;
      }

      setMessage('Request rejected');
      router.refresh();
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setLoading({ ...loading, [requestId]: false });
    }
  };

  const handleToggleAttendance = async () => {
    setLoading({ ...loading, attendance: true });
    setMessage('');

    const newAttendingStatus = !attending;

    try {
      const response = await fetch('/api/profile/update-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendingNextGathering: newAttendingStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Update failed');
        return;
      }

      setAttending(newAttendingStatus);
      setMessage(newAttendingStatus ? 'Marked as attending!' : 'Marked as not attending');

      // Immediately update the attendees list for instant UI feedback
      if (newAttendingStatus) {
        // Add current user to attendees list
        const userInList = attendees.some(a => a._id.toString() === currentUserId);
        if (!userInList && currentUser) {
          setAttendees([...attendees, {
            _id: currentUser._id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            chessComData: currentUser.chessComData,
            manualRating: currentUser.manualRating,
            preferredStrength: currentUser.preferredStrength,
          }].sort((a, b) => {
            // Sort by last name, then first name
            const lastNameCompare = a.lastName.localeCompare(b.lastName);
            if (lastNameCompare !== 0) return lastNameCompare;
            return a.firstName.localeCompare(b.firstName);
          }));
        }
      } else {
        // Remove current user from attendees list
        setAttendees(attendees.filter(a => a._id.toString() !== currentUserId));
      }

      // Refresh to sync with database - this ensures other users will see the update when they refresh
      router.refresh();
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setLoading({ ...loading, attendance: false });
    }
  };

  const pendingRequestsToMe = myRequests.filter(
    r => r.requested._id.toString() === currentUserId && r.status === 'pending'
  );
  const myPendingRequests = myRequests.filter(
    r => r.requester._id.toString() === currentUserId && r.status === 'pending'
  );
  const myAcceptedRequests = myRequests.filter(
    r => r.status === 'accepted' && (
      r.requester._id.toString() === currentUserId || 
      r.requested._id.toString() === currentUserId
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-whisky-900 mb-8">Next Gathering</h1>

      {message && (
        <div className={`mb-4 p-4 rounded-lg shadow-md border-2 ${
          message.includes('success') || message.includes('matched') || message.includes('attending')
            ? 'bg-whisky-100 text-whisky-800 border-amber'
            : 'bg-burgundy-light text-white border-burgundy'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-whisky-900 mb-2">
              {formatDate(nextGathering)}
            </h2>
            <p className="text-lg text-whisky-800 mb-2 font-medium">
              {gatheringTime}
            </p>
            <p className="text-whisky-700 mb-2">Biweekly gathering - every second Wednesday</p>
            <div className="mt-3">
              <p className="text-sm font-medium text-whisky-800 mb-1">📍 Location:</p>
              <p className="text-whisky-700 mb-3">{gatheringLocation}</p>
              {gatheringCoordinates && (
                <div className="mt-4">
                  <LocationMap
                    latitude={gatheringCoordinates.latitude}
                    longitude={gatheringCoordinates.longitude}
                    locationName={gatheringLocation}
                  />
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleToggleAttendance}
            disabled={loading.attendance}
            className={`px-6 py-2 rounded-md shadow-md font-medium transition-colors ${
              attending
                ? 'bg-amber text-white hover:bg-amber-dark'
                : 'bg-whisky-200 text-whisky-800 hover:bg-whisky-300 border-2 border-whisky-300'
            } disabled:opacity-50`}
          >
            {loading.attendance ? 'Updating...' : attending ? '✓ Attending' : 'Mark as Attending'}
          </button>
        </div>
      </div>

      <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-whisky-900 mb-4 border-b-2 border-whisky-300 pb-2">
          Attendees ({attendees.length})
        </h2>
        {attendees.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-whisky-700 mb-2">No one has marked attendance yet.</p>
            <p className="text-sm text-whisky-600">Be the first to mark yourself as attending!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(() => {
              // Organize attendees into pairs and singles
              const processed = new Set();
              const rows = [];

              attendees.forEach((attendee) => {
                if (!attendee || !attendee._id || processed.has(attendee._id.toString())) {
                  return;
                }

                const attendeeId = attendee._id.toString();
                const pairedWithId = pairings[attendeeId];

                if (pairedWithId) {
                  // Find the paired attendee
                  const pairedAttendee = attendees.find(a => a && a._id && a._id.toString() === pairedWithId);
                  if (pairedAttendee) {
                    // Create a row with both cards and "vs" indicator
                    rows.push(
                      <div key={`pair-${attendeeId}`} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                        {renderAttendeeCard(attendee)}
                        <div className="hidden md:flex items-center justify-center">
                          <span className="text-2xl font-bold text-amber px-2">vs</span>
                        </div>
                        {renderAttendeeCard(pairedAttendee)}
                      </div>
                    );
                    processed.add(attendeeId);
                    processed.add(pairedWithId);
                  } else {
                    // Paired attendee not found, show as single
                    rows.push(renderAttendeeCard(attendee, true));
                    processed.add(attendeeId);
                  }
                } else {
                  // Single attendee
                  rows.push(renderAttendeeCard(attendee, true));
                  processed.add(attendeeId);
                }
              });

              return rows;
            })()}
          </div>
        )}
      </div>

      {myAcceptedRequests.length > 0 && (
        <div className="bg-whisky-100 border-2 border-amber rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-whisky-900 mb-4">Your Match</h2>
            {myAcceptedRequests.map((request) => {
            const opponent = request.requester._id.toString() === currentUserId
              ? request.requested
              : request.requester;
            return (
              <div key={request._id} className="bg-white rounded-lg border-2 border-whisky-300 p-4">
                <Link
                  href={`/users/${opponent._id}`}
                  className="text-lg font-medium text-whisky-900 hover:text-amber transition-colors"
                >
                  {opponent.firstName} {opponent.lastName}
                </Link>
                <p className="text-sm text-whisky-700">You are matched for this gathering!</p>
              </div>
            );
          })}
        </div>
      )}

      {pendingRequestsToMe.length > 0 && (
        <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-whisky-900 mb-4 border-b-2 border-whisky-300 pb-2">Pending Requests</h2>
          <div className="space-y-4">
            {pendingRequestsToMe.map((request) => (
              <div key={request._id} className="border-2 border-whisky-300 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <Link
                      href={`/users/${request.requester._id}`}
                      className="font-medium text-whisky-900 hover:text-amber transition-colors"
                    >
                      {request.requester.firstName} {request.requester.lastName}
                    </Link>
                    <p className="text-sm text-whisky-700">wants to play with you</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request._id)}
                      disabled={loading[request._id]}
                      className="px-4 py-2 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md disabled:opacity-50 transition-colors font-medium"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      disabled={loading[request._id]}
                      className="px-4 py-2 bg-burgundy text-white rounded-md hover:bg-burgundy-dark shadow-md disabled:opacity-50 transition-colors font-medium"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {myPendingRequests.length > 0 && (
        <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-whisky-900 mb-4 border-b-2 border-whisky-300 pb-2">Your Pending Requests</h2>
          <div className="space-y-4">
            {myPendingRequests.map((request) => (
              <div key={request._id} className="border-2 border-whisky-300 rounded-lg p-4 bg-white">
                <Link
                  href={`/users/${request.requested._id}`}
                  className="font-medium text-whisky-900 hover:text-amber transition-colors"
                >
                  {request.requested.firstName} {request.requested.lastName}
                </Link>
                <p className="text-sm text-whisky-700">Waiting for response...</p>
              </div>
            ))}
          </div>
        </div>
      )}


      {matchedPairs.length > 0 && (
        <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-whisky-900 mb-4 border-b-2 border-whisky-300 pb-2">All Matched Pairs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedPairs.map((pair) => (
              <div key={pair._id} className="border-2 border-whisky-300 rounded-lg p-4 bg-white">
                <p className="font-medium text-whisky-900">
                  <Link
                    href={`/users/${pair.requester._id}`}
                    className="hover:text-amber transition-colors"
                  >
                    {pair.requester.firstName} {pair.requester.lastName}
                  </Link>
                  {' vs '}
                  <Link
                    href={`/users/${pair.requested._id}`}
                    className="hover:text-amber transition-colors"
                  >
                    {pair.requested.firstName} {pair.requested.lastName}
                  </Link>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <GatheringChat gatheringDate={nextGathering} currentUserId={currentUserId} />
    </div>
  );
}

