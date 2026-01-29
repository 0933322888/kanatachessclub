import { getSiteConfig } from './site-config.js';

export function getNextGatheringDate() {
  const { gatheringDay } = getSiteConfig();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Helper to find the nth occurrence of a day in a month
  const getGatheringDate = (year, month, weekOffset = 0) => {
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    const daysUntilTargetDay = (gatheringDay - firstDayOfWeek + 7) % 7;
    // Add weeks based on offset (0 for 1st occurrence, 2 for 3rd occurrence)
    return new Date(year, month, 1 + daysUntilTargetDay + (weekOffset * 7));
  };

  // Check 1st occurrence this month
  const firstGathering = getGatheringDate(currentYear, currentMonth, 0);
  if (today <= firstGathering) return firstGathering;

  // Check 3rd occurrence this month (bi-weekly usually means 1st and 3rd, or every 2 weeks)
  // adding 14 days to the first occurrence
  const secondGathering = new Date(firstGathering);
  secondGathering.setDate(firstGathering.getDate() + 14);

  if (today <= secondGathering) return secondGathering;

  // If we passed both, get 1st occurrence of next month
  let nextMonth = currentMonth + 1;
  let nextYear = currentYear;
  if (nextMonth > 11) {
    nextMonth = 0;
    nextYear++;
  }
  return getGatheringDate(nextYear, nextMonth, 0);
}

export function getAllUpcomingGatherings(count = 5) {
  const gatherings = [];
  let currentDate = getNextGatheringDate();

  for (let i = 0; i < count; i++) {
    gatherings.push(new Date(currentDate));
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 14); // Add 2 weeks
  }

  return gatherings;
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

