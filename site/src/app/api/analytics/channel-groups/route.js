import { MOCK_CHANNEL_GROUPS } from '../mockData';
import { answerOf, reportBody, reportOf, rowsOf } from '../google';
export const GET = () => answerOf(MOCK_CHANNEL_GROUPS, async () => {
    const channels = rowsOf(await reportOf('properties.runReport', reportBody('sessionDefaultChannelGroup', 'sessions', 7)), 'channel', 'sessions').map((c) => ({ ...c, channel: c.channel || 'Unknown' }));
    return { channels, totalSessions: channels.reduce((sum, c) => sum + c.sessions, 0), period: 'Last 7 days', timestamp: new Date().toISOString() };
});
