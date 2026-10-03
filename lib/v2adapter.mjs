/**
 * v2adapter.mjs
 * Compatibility shim: exposes /api/v2 routes that CarbonSynq-Frontend-main
 * (Next.js) expects, backed entirely by the v1 SQLite demo server internals.
 */
import { dashboard, metadata, auditList } from './dashboard.mjs';
import { login as v1Login } from './auth.mjs';
import { listActivities, getActivity, createActivity, updateActivity, deleteActivity, transition } from './activities.mjs';
import { listDocuments } from './invoices.mjs';
import { round } from './shared.mjs';

export function v2ok(res, data, requestId, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ success: true, data, requestId }));
}

export function v2err(res, status, message, requestId) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ success: false, error: message, message, requestId }));
}

// POST /api/v2/auth/login
export async function v2Login(db, body, requestId, res) {
  const v1Result = await v1Login(db, body);
  const u = v1Result.user;
  v2ok(res, {
    token: v1Result.token,
    expiresInSeconds: v1Result.expiresIn,
    user: {
      id: u.id,
      username: u.name,
      email: u.email,
      role: u.role,
      organisationId: u.universityId,
      tenantId: 'demo-university',
    },
  }, requestId);
}

// GET /api/v2/auth/me
export function v2Me(user, requestId, res) {
  v2ok(res, {
    id: user.id,
    username: user.name,
    email: user.email,
    role: user.role,
    organisationId: user.university_id,
    tenantId: 'demo-university',
  }, requestId);
}

// GET /api/v2/reporting-periods
export function v2ReportingPeriods(db, user, requestId, res) {
  const meta = metadata(db, user);
  v2ok(res, meta.reportingPeriods.map(p => ({
    id: p.id,
    name: p.name,
    startDate: p.startDate,
    endDate: p.endDate,
    status: p.status,
    universityId: user.university_id,
    isBaseline: false,
  })), requestId);
}

// GET /api/v2/dashboard/summary
export function v2DashboardSummary(db, user, query, requestId, res) {
  const v1 = dashboard(db, user, query);
  const scope1 = v1.byScope.find(s => s.name === 'SCOPE_1');
  const scope2 = v1.byScope.find(s => s.name === 'SCOPE_2');
  v2ok(res, {
    overview: {
      totalEmissionsTonnes: v1.totalTCO2e,
      scope1Tonnes: scope1?.tCO2e ?? 0,
      scope2Tonnes: scope2?.tCO2e ?? 0,
      scope3Tonnes: 0,
      delta: 0,
      reductionPercentage: 0,
    },
    trends: v1.monthly.map(m => ({
      month: m.month + '-01',
      totalKg: round(m.totalTCO2e * 1000, 2),
      scope1Kg: round(m.scope1TCO2e * 1000, 2),
      scope2Kg: round(m.scope2TCO2e * 1000, 2),
    })),
    categories: v1.byCategory.map(c => ({
      category: c.name,
      scope: 'SCOPE_1',
      tonnesCO2e: c.tCO2e,
      trend: 0,
    })),
    scopeBreakdown: {
      scope1: { tCO2e: scope1?.tCO2e ?? 0, delta: 0 },
      scope2: { tCO2e: scope2?.tCO2e ?? 0, delta: 0 },
    },
    intensity: { tonnesPerStudent: 0, kgPerSqm: 0 },
    groups: v1.byCampus.map(c => ({ name: c.name, tCO2e: c.tCO2e, share: c.share })),
    recentActivity: v1.recentActivities.slice(0, 6).map(a => ({
      id: a.id, category: a.category, campus: a.campusName, date: a.activityDate,
      quantity: a.quantity, unit: a.unit, status: a.status, kgCO2e: a.calculation?.kgCO2e ?? null,
    })),
    activityStats: {
      total: v1.totalActivities,
      draft: v1.statusCounts?.DRAFT ?? 0,
      submitted: v1.statusCounts?.SUBMITTED ?? 0,
      underReview: v1.statusCounts?.UNDER_REVIEW ?? 0,
      verified: v1.statusCounts?.VERIFIED ?? 0,
      rejected: v1.statusCounts?.REJECTED ?? 0,
      calculated: v1.calculatedActivities,
      pending: v1.pendingReview,
      verifiedTotal: v1.statusCounts?.VERIFIED ?? 0,
    },
    targets: [],
    insight: v1.insight,
    demoOnly: true,
  }, requestId);
}

// GET /api/v2/activity-data
export function v2ActivityList(db, user, query, requestId, res) {
  v2ok(res, listActivities(db, user, query), requestId);
}

// GET /api/v2/activity-data/review
export function v2ReviewQueue(db, user, query, requestId, res) {
  v2ok(res, listActivities(db, user, { ...query, status: 'REVIEW_QUEUE' }), requestId);
}

// GET /api/v2/activity-data/:id
export function v2ActivityGet(db, user, aid, requestId, res) {
  v2ok(res, getActivity(db, user, aid), requestId);
}

// POST /api/v2/activity-data
export function v2ActivityCreate(db, user, body, idempotencyKey, requestId, res) {
  v2ok(res, createActivity(db, user, body, idempotencyKey, requestId), requestId, 201);
}

// PATCH /api/v2/activity-data/:id
export function v2ActivityUpdate(db, user, aid, body, requestId, res) {
  v2ok(res, updateActivity(db, user, aid, body, requestId), requestId);
}

// DELETE /api/v2/activity-data/:id
export function v2ActivityDelete(db, user, aid, body, requestId, res) {
  v2ok(res, deleteActivity(db, user, aid, body, requestId), requestId);
}

// POST /api/v2/activity-data/:id/(submit|start-review|verify|reject|calculate)
export function v2ActivityTransition(db, user, aid, action, body, requestId, res) {
  v2ok(res, transition(db, user, aid, action, body, requestId), requestId);
}

// GET /api/v2/audit-logs
export function v2AuditLogs(db, user, query, requestId, res) {
  v2ok(res, auditList(db, user, query), requestId);
}

// GET /api/v2/university/campuses
export function v2Campuses(db, user, requestId, res) {
  v2ok(res, metadata(db, user).campuses.map(c => ({
    id: c.id, name: c.name, code: c.code, universityId: user.university_id,
  })), requestId);
}

// GET /api/v2/emission-factors
export function v2EmissionFactors(db, user, requestId, res) {
  v2ok(res, metadata(db, user).factors, requestId);
}

// GET /api/v2/reports/summary
export function v2ReportsSummary(db, user, query, requestId, res) {
  const v1 = dashboard(db, user, query);
  v2ok(res, {
    university: db.prepare('SELECT name FROM universities WHERE id=?').get(user.university_id)?.name ?? '',
    generatedAt: new Date().toISOString(),
    summary: v1,
    demoOnly: true,
  }, requestId);
}

// GET /api/v2/university/targets
export function v2Targets(requestId, res) {
  v2ok(res, [], requestId);
}

// GET /api/v2/documents
export function v2Documents(db, user, query, requestId, res) {
  v2ok(res, listDocuments(db, user, query), requestId);
}
