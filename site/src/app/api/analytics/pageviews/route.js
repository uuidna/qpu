import { MOCK_ANALYTICS_METRICS } from '../mockData';
import { answerOf, reportBody, reportOf, rowsOf, week } from '../google';
export const GET = () => answerOf(MOCK_ANALYTICS_METRICS, async () => {
    const [pages, overview, daily] = await Promise.all([reportOf('properties.runReport', reportBody('pagePath', 'screenPageViews', 10)), reportOf('properties.runReport', { dateRanges: week, metrics: ['activeUsers', 'totalUsers', 'screenPageViews', 'eventCount', 'conversions'].map((name) => ({ name })) }), reportOf('properties.runReport', { dateRanges: week, dimensions: [{ name: 'date' }], metrics: [{ name: 'activeUsers' }], orderBys: [{ dimension: { dimensionName: 'date' } }] })]);
    const [activeUsers, totalUsers, totalPageViews, eventCount, keyEvents] = [0, 1, 2, 3, 4].map((i) => parseInt(overview.rows?.[0]?.metricValues?.[i]?.value || '0', 10));
    return { activeUsers, totalUsers, totalPageViews, eventCount, keyEvents, topPages: rowsOf(pages, 'page', 'views'), chartData: rowsOf(daily, 'date', 'users'), period: 'Last 7 days' };
});
