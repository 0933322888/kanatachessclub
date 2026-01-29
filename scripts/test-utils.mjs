import { getNextGatheringDate, formatDate } from '../lib/utils.js';

console.log('--- Verification Script ---');

// Mock specific dates to test logic? 
// For now, we just test that changing ENV var changes the result day.

// TEST 1: KANATA (Wednesday)
process.env.NEXT_PUBLIC_CLUB_ID = 'kanata';
console.log('\nTesting KANATA (expecting Wednesday)...');
const kanataDate = getNextGatheringDate();
console.log(`Date: ${formatDate(kanataDate)}`);
if (kanataDate.getDay() === 3) {
    console.log('✅ PASS: Day is Wednesday');
} else {
    console.error(`❌ FAIL: Expected Wednesday (3), got ${kanataDate.getDay()}`);
}


// TEST 2: BARRHAVEN (Thursday)
process.env.NEXT_PUBLIC_CLUB_ID = 'barrhaven';
console.log('\nTesting BARRHAVEN (expecting Thursday)...');
const barrhavenDate = getNextGatheringDate();
console.log(`Date: ${formatDate(barrhavenDate)}`);
if (barrhavenDate.getDay() === 4) {
    console.log('✅ PASS: Day is Thursday');
} else {
    console.error(`❌ FAIL: Expected Thursday (4), got ${barrhavenDate.getDay()}`);
}

console.log('--- End Verification ---');
