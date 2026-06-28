/**
 * Date Range Utility Functions
 * Converts date filter options to SQL-compatible date ranges
 */

export function getDateRange(range) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (range) {
    case 'today':
      return {
        startDate: formatDate(today),
        endDate: formatDate(today),
        previousStartDate: formatDate(new Date(today.getTime() - 24 * 60 * 60 * 1000)),
        previousEndDate: formatDate(new Date(today.getTime() - 24 * 60 * 60 * 1000)),
      };

    case '7d':
    case 'last_7_days':
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const prevSevenDaysStart = new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
      const prevSevenDaysEnd = new Date(sevenDaysAgo.getTime() - 24 * 60 * 60 * 1000);
      return {
        startDate: formatDate(sevenDaysAgo),
        endDate: formatDate(today),
        previousStartDate: formatDate(prevSevenDaysStart),
        previousEndDate: formatDate(prevSevenDaysEnd),
      };

    case '30d':
    case 'last_30_days':
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const prevThirtyDaysStart = new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000);
      const prevThirtyDaysEnd = new Date(thirtyDaysAgo.getTime() - 24 * 60 * 60 * 1000);
      return {
        startDate: formatDate(thirtyDaysAgo),
        endDate: formatDate(today),
        previousStartDate: formatDate(prevThirtyDaysStart),
        previousEndDate: formatDate(prevThirtyDaysEnd),
      };

    case 'this_month':
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        startDate: formatDate(monthStart),
        endDate: formatDate(today),
        previousStartDate: formatDate(prevMonthStart),
        previousEndDate: formatDate(prevMonthEnd),
      };

    case 'last_month':
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      const prevLastMonthStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const prevLastMonthEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0);
      return {
        startDate: formatDate(lastMonthStart),
        endDate: formatDate(lastMonthEnd),
        previousStartDate: formatDate(prevLastMonthStart),
        previousEndDate: formatDate(prevLastMonthEnd),
      };

    case 'this_year':
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const prevYearStart = new Date(now.getFullYear() - 1, 0, 1);
      const prevYearEnd = new Date(now.getFullYear() - 1, 11, 31);
      return {
        startDate: formatDate(yearStart),
        endDate: formatDate(today),
        previousStartDate: formatDate(prevYearStart),
        previousEndDate: formatDate(prevYearEnd),
      };

    default:
      // Default to last 30 days
      const defaultThirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const defaultPrevThirtyDaysStart = new Date(defaultThirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000);
      const defaultPrevThirtyDaysEnd = new Date(defaultThirtyDaysAgo.getTime() - 24 * 60 * 60 * 1000);
      return {
        startDate: formatDate(defaultThirtyDaysAgo),
        endDate: formatDate(today),
        previousStartDate: formatDate(defaultPrevThirtyDaysStart),
        previousEndDate: formatDate(defaultPrevThirtyDaysEnd),
      };
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateRange(range) {
  const mapping = {
    'Today': 'today',
    'Last 7 Days': '7d',
    'Last 30 Days': '30d',
    'This Month': 'this_month',
    'Last Month': 'last_month',
    'This Year': 'this_year',
  };
  return mapping[range] || '30d';
}
