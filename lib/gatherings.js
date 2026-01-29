import { getSiteConfig } from './site-config';
import connectDB from './mongodb';
import Gathering from '../models/Gathering';

/**
 * Calculates the RAW default gathering dates (slots) without checking overrides.
 */
export function getDefaultGatheringSlots(count = 5, startDate = new Date(), clubId = null) {
    const { gatheringDay } = getSiteConfig(clubId);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const slots = [];
    let currentSearchDate = new Date(start);

    while (slots.length < count) {
        const currentMonth = currentSearchDate.getMonth();
        const currentYear = currentSearchDate.getFullYear();

        // Helper to find the nth occurrence of a day in a month
        const getGatheringDate = (year, month, weekOffset = 0) => {
            const firstDay = new Date(year, month, 1);
            const firstDayOfWeek = firstDay.getDay();
            const daysUntilTargetDay = (gatheringDay - firstDayOfWeek + 7) % 7;
            return new Date(year, month, 1 + daysUntilTargetDay + (weekOffset * 7));
        };

        // Check occurrences in current month
        const firstGathering = getGatheringDate(currentYear, currentMonth, 0);
        const secondGathering = new Date(firstGathering);
        secondGathering.setDate(firstGathering.getDate() + 14);
        const thirdGathering = new Date(secondGathering);
        thirdGathering.setDate(secondGathering.getDate() + 14);

        const occurrences = [firstGathering, secondGathering];
        if (thirdGathering.getMonth() === currentMonth) {
            occurrences.push(thirdGathering);
        }

        for (const occ of occurrences) {
            if (occ >= start && !slots.some(s => s.getTime() === occ.getTime())) {
                slots.push(occ);
                if (slots.length === count) break;
            }
        }

        // Move to next month
        currentSearchDate = new Date(currentYear, currentMonth + 1, 1);
    }

    return slots;
}

/**
 * Gets the next valid gathering date, accounting for cancellations and moved dates.
 */
export async function getNextGatheringDate() {
    const gatherings = await getUpcomingGatherings(1);
    return gatherings[0]?.date || null;
}

/**
 * Gets the next N gatherings, accounting for overrides.
 */
export async function getUpcomingGatherings(count = 5, clubId = null) {
    await connectDB();
    const currentClubId = clubId || process.env.NEXT_PUBLIC_CLUB_ID || 'kanata';
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const finalGatherings = [];
    let slotsToFetch = count + 2; // Fetch extra in case some are cancelled
    let currentStartDate = new Date(today);

    while (finalGatherings.length < count) {
        const slots = getDefaultGatheringSlots(slotsToFetch, currentStartDate, currentClubId);

        const overrides = await Gathering.find({
            originalDate: { $in: slots },
            clubId: currentClubId
        });

        for (const slot of slots) {
            const override = overrides.find(o => o.originalDate.getTime() === slot.getTime());

            if (!override) {
                finalGatherings.push({ date: slot, isOverridden: false, isCancelled: false });
            } else if (override.isCancelled) {
                // Skip this one
                continue;
            } else if (override.overriddenDate) {
                // If moved date is in the future, include it
                if (override.overriddenDate >= today) {
                    finalGatherings.push({
                        date: override.overriddenDate,
                        originalDate: slot,
                        isOverridden: true,
                        isCancelled: false,
                        note: override.note
                    });
                }
            } else {
                // Normal date but maybe has a note
                finalGatherings.push({
                    date: slot,
                    isOverridden: false,
                    isCancelled: false,
                    note: override.note
                });
            }

            if (finalGatherings.length === count) break;
        }

        if (finalGatherings.length < count) {
            // We need more slots, move start date to past the last slot we checked
            currentStartDate = new Date(slots[slots.length - 1]);
            currentStartDate.setDate(currentStartDate.getDate() + 1);
            slotsToFetch = count - finalGatherings.length + 2;
        }
    }

    // Sort by date just in case overrides moved things out of order
    return finalGatherings.sort((a, b) => a.date - b.date).slice(0, count);
}
