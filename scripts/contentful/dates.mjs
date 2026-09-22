/** Month-precision tenure parsing for resume roles/projects. */

const MONTHS = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
  may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8,
  sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11,
  dec: 12, december: 12,
};

function pad(value) {
  return String(value).padStart(2, '0');
}

/** First day of month as YYYY-MM-DD. */
export function monthStart(year, month) {
  return `${year}-${pad(month)}-01`;
}

/** Last day of month as YYYY-MM-DD. */
export function monthEnd(year, month) {
  const day = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${year}-${pad(month)}-${pad(day)}`;
}

function parseMonthToken(token) {
  const match = token.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!match) return null;
  const month = MONTHS[match[1].toLowerCase()];
  const year = Number(match[2]);
  if (!month || !Number.isInteger(year)) return null;
  return { year, month };
}

function parseYearToken(token) {
  const match = token.trim().match(/^(\d{4})$/);
  if (!match) return null;
  const year = Number(match[1]);
  if (!Number.isInteger(year)) return null;
  return { year };
}

/**
 * Parse labels like "Feb 2026 - Present", "Aug 2014 - Aug 2018", or year-only "2008 - 2009".
 * Returns ISO dates: start = first of start month (or Jan 1 for year-only);
 * end = last of end month / Dec 31 for year-only (omitted for Present).
 */
export function parseDateRange(label) {
  const normalized = label.trim().replace(/\u2013|\u2014/g, '-').replace(/\s+/g, ' ');
  const parts = normalized.split(/\s+-\s+/);
  if (parts.length !== 2) throw new Error(`Unrecognized date range: ${label}`);

  const startMonth = parseMonthToken(parts[0]);
  const startYear = !startMonth ? parseYearToken(parts[0]) : null;
  if (!startMonth && !startYear) throw new Error(`Unrecognized start date: ${label}`);
  const startDate = startMonth
    ? monthStart(startMonth.year, startMonth.month)
    : monthStart(startYear.year, 1);

  if (/^present$/i.test(parts[1].trim())) return { startDate };

  const endMonth = parseMonthToken(parts[1]);
  const endYear = !endMonth ? parseYearToken(parts[1]) : null;
  if (!endMonth && !endYear) throw new Error(`Unrecognized end date: ${label}`);
  if ((startMonth && endYear) || (startYear && endMonth)) {
    throw new Error(`Mixed month/year precision not supported: ${label}`);
  }
  const endDate = endMonth
    ? monthEnd(endMonth.year, endMonth.month)
    : monthEnd(endYear.year, 12);
  return { startDate, endDate };
}
