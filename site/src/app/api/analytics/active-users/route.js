import { MOCK_ACTIVE_USERS } from '../mockData';
import { answerOf, reportOf, rowsOf } from '../google';
export const GET = () => answerOf(MOCK_ACTIVE_USERS, async () => {
    const all = rowsOf(await reportOf('properties.runRealtimeReport', { dimensions: [{ name: 'country' }], metrics: [{ name: 'activeUsers' }], orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }] }), 'country', 'activeUsers').map((l) => ({ ...l, country: l.country || 'Unknown' }));
    return { totalActiveUsers: all.reduce((sum, l) => sum + l.activeUsers, 0), locations: all.slice(0, 3), timestamp: new Date().toISOString() };
});
