'use strict';

// Private calendar-date policy. No date of birth is returned to public clients.
// Fail closed on absent, malformed, impossible or future dates.
export function validBirthDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1900 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return day <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

export function portalCalendarDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Campo_Grande', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now);
  const part = type => parts.find(p => p.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function privatePetAgeStatus(birthDate, today = portalCalendarDate()) {
  if (!validBirthDate(birthDate) || !validBirthDate(today) || birthDate > today) return 'unknown';
  const [year, month, day] = birthDate.split('-').map(Number);
  const [currentYear, currentMonth, currentDay] = today.split('-').map(Number);
  // A Feb 29 birthday remains gated through Feb 28 in a non-leap year.
  const birthdayReached = currentMonth > month || (currentMonth === month && currentDay >= day);
  return currentYear - year - (birthdayReached ? 0 : 1) >= 18 ? 'adult' : 'underage';
}
