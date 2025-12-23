export function getNextGatheringDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the first Wednesday of the current month
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Find first Wednesday of the month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const firstDayOfWeek = firstDay.getDay();
  const daysUntilFirstWednesday = (3 - firstDayOfWeek + 7) % 7;
  const firstWednesday = new Date(currentYear, currentMonth, 1 + daysUntilFirstWednesday);

  // If today is before or on the first Wednesday, return it
  if (today <= firstWednesday) {
    return firstWednesday;
  }

  // Otherwise, find the next month's first Wednesday
  let nextMonth = currentMonth + 1;
  let nextYear = currentYear;
  if (nextMonth > 11) {
    nextMonth = 0;
    nextYear++;
  }

  const nextFirstDay = new Date(nextYear, nextMonth, 1);
  const nextFirstDayOfWeek = nextFirstDay.getDay();
  const nextDaysUntilFirstWednesday = (3 - nextFirstDayOfWeek + 7) % 7;
  const nextFirstWednesday = new Date(nextYear, nextMonth, 1 + nextDaysUntilFirstWednesday);

  return nextFirstWednesday;
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

