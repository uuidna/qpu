// The dashboard's Google Analytics reports through the one door: an entry of kind call asks the qpu-google-call job of the qpu-google
// plugin (the property from GA_PROPERTY_ID, the credential the one the tenant's bindings name, resolved on the server by the job), and
// the job's answer entry is read back. No Google call is made here.
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
export async function reportOf(method, body) {
    if (!process.env.GA_PROPERTY_ID) throw new Error('Google Analytics not configured: set GA_PROPERTY_ID and name the credential in the tenant bindings');
    const payload = await getPayload({ config });
    const asked = await payload.create({ collection: 'entries', overrideAccess: true, data: { kind: 'call', from: 'qpu-google-call', body: { api: 'analyticsdata', version: 'v1beta', method, params: { property: 'properties/' + process.env.GA_PROPERTY_ID }, body, at: new Date().toISOString() } } });
    const answer = (await payload.find({ collection: 'entries', where: { from: { equals: 'qpu-google-call' }, 'body.request': { equals: asked.id } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]?.body;
    if (!answer?.allowed || answer.status !== 200) throw new Error(answer ? answer.why ?? `HTTP ${answer.status}: ${answer.answer}` : 'the qpu-google-call job did not answer');
    return JSON.parse(answer.answer);
}
// one row of a report: its first dimension and its first metric, as the widgets read them
export const rowsOf = (data, key, value) => data.rows?.map((row) => ({ [key]: row.dimensionValues?.[0]?.value || '', [value]: parseInt(row.metricValues?.[0]?.value || '0', 10) })) || [];
export const week = [{ startDate: '7daysAgo', endDate: 'today' }];
export const reportBody = (dimension, metric, limit) => ({ dateRanges: week, dimensions: [{ name: dimension }], metrics: [{ name: metric }], orderBys: [{ metric: { metricName: metric }, desc: true }], limit });
// the widget's answer, its demo data when GA_USE_DEMO_DATA is true, or the refusal with its reason
export const answerOf = async (mock, compute) => {
    if (process.env.GA_USE_DEMO_DATA === 'true') return NextResponse.json(mock);
    try { return NextResponse.json(await compute()); }
    catch (error) { return NextResponse.json({ error: 'Failed to fetch analytics', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 }); }
};
