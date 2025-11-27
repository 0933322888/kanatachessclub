export function getNextGatheringDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find the second Wednesday of the current month
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Find first Wednesday of the month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const firstDayOfWeek = firstDay.getDay();
  const daysUntilFirstWednesday = (3 - firstDayOfWeek + 7) % 7;
  const firstWednesday = new Date(currentYear, currentMonth, 1 + (daysUntilFirstWednesday === 0 ? 7 : daysUntilFirstWednesday));
  
  // Second Wednesday is 7 days after first
  const secondWednesday = new Date(firstWednesday);
  secondWednesday.setDate(secondWednesday.getDate() + 7);
  
  // If today is before or on the second Wednesday, return it
  if (today <= secondWednesday) {
    return secondWednesday;
  }
  
  // Otherwise, find the next month's second Wednesday
  let nextMonth = currentMonth + 1;
  let nextYear = currentYear;
  if (nextMonth > 11) {
    nextMonth = 0;
    nextYear++;
  }
  
  const nextFirstDay = new Date(nextYear, nextMonth, 1);
  const nextFirstDayOfWeek = nextFirstDay.getDay();
  const nextDaysUntilFirstWednesday = (3 - nextFirstDayOfWeek + 7) % 7;
  const nextFirstWednesday = new Date(nextYear, nextMonth, 1 + (nextDaysUntilFirstWednesday === 0 ? 7 : nextDaysUntilFirstWednesday));
  
  const nextSecondWednesday = new Date(nextFirstWednesday);
  nextSecondWednesday.setDate(nextSecondWednesday.getDate() + 7);
  
  return nextSecondWednesday;
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

