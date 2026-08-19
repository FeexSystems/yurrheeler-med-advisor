import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, jsonb, boolean, integer, numeric, date, primaryKey } from 'drizzle-orm/pg-core';

// ------------------------------------------------------------
// core tables
// ------------------------------------------------------------

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().unique(), // Firebase Auth UID
  displayName: text('display_name'),
  role: text('role').default('patient'),
  avatarUrl: text('avatar_url'),
  locale: text('locale'),
  timezone: text('timezone'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const patients = pgTable('patients', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').references(() => profiles.id),
  externalReference: text('external_reference'),
  dateOfBirth: date('date_of_birth'),
  sexAtBirth: text('sex_at_birth'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const consultations = pgTable('consultations', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').references(() => patients.id).notNull(),
  userId: text('user_id').notNull(), // User creating/running the consultation
  status: text('status').default('active'),
  chiefConcern: text('chief_concern'),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  triageLevel: text('triage_level'),
  summary: text('summary'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  consultationId: uuid('consultation_id').references(() => consultations.id).notNull(),
  title: text('title'),
  status: text('status'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  role: text('role').notNull(), // user, assistant, system, agent, tool
  content: text('content').notNull(),
  agentId: uuid('agent_id'), 
  sequenceNumber: integer('sequence_number'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ------------------------------------------------------------
// Agents & Executions
// ------------------------------------------------------------

export const clinicalAgents = pgTable('clinical_agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(), // yurrheeler, cardia, etc
  name: text('name').notNull(),
  specialty: text('specialty'),
  description: text('description'),
  status: text('status').default('active'),
  avatarType: text('avatar_type'),
  avatarConfig: jsonb('avatar_config'),
  visualConfig: jsonb('visual_config'),
  systemPromptVersion: text('system_prompt_version'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const agentRuns = pgTable('agent_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  consultationId: uuid('consultation_id').references(() => consultations.id).notNull(),
  conversationId: uuid('conversation_id').references(() => conversations.id),
  agentId: uuid('agent_id').references(() => clinicalAgents.id).notNull(),
  status: text('status').notNull(), // queued, running, completed, failed, cancelled
  inputContext: jsonb('input_context'),
  outputSummary: text('output_summary'),
  modelProvider: text('model_provider'),
  modelName: text('model_name'),
  promptVersion: text('prompt_version'),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  latencyMs: integer('latency_ms'),
  errorCode: text('error_code'),
  metadata: jsonb('metadata'),
});

export const agentEvents = pgTable('agent_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentRunId: uuid('agent_run_id').references(() => agentRuns.id),
  agentId: uuid('agent_id').references(() => clinicalAgents.id).notNull(),
  eventType: text('event_type').notNull(),
  payload: jsonb('payload'),
  sequenceNumber: integer('sequence_number'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ------------------------------------------------------------
// Clinical Events & Observations
// ------------------------------------------------------------

export const clinicalEvents = pgTable('clinical_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  consultationId: uuid('consultation_id').references(() => consultations.id).notNull(),
  patientId: uuid('patient_id').references(() => patients.id).notNull(),
  eventType: text('event_type').notNull(),
  sourceType: text('source_type'),
  sourceId: uuid('source_id'),
  payload: jsonb('payload'),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const clinicalObservations = pgTable('clinical_observations', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').references(() => patients.id).notNull(),
  consultationId: uuid('consultation_id').references(() => consultations.id),
  type: text('type').notNull(),
  code: text('code'),
  valueNumeric: numeric('value_numeric'),
  valueText: text('value_text'),
  unit: text('unit'),
  referenceRange: jsonb('reference_range'),
  status: text('status'),
  source: text('source'),
  observedAt: timestamp('observed_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const vitalObservations = pgTable('vital_observations', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').references(() => patients.id).notNull(),
  consultationId: uuid('consultation_id').references(() => consultations.id),
  temperature: numeric('temperature'),
  heartRate: numeric('heart_rate'),
  systolicBp: numeric('systolic_bp'),
  diastolicBp: numeric('diastolic_bp'),
  oxygenSaturation: numeric('oxygen_saturation'),
  respiratoryRate: numeric('respiratory_rate'),
  glucose: numeric('glucose'),
  source: text('source'),
  recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow(),
});

// ------------------------------------------------------------
// Anatomy & Evidence
// ------------------------------------------------------------

export const anatomicalRegions = pgTable('anatomical_regions', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  label: text('label').notNull(),
  system: text('system'),
  parentId: uuid('parent_id'),
  description: text('description'),
  spatialConfig: jsonb('spatial_config'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const agentAnatomyRegions = pgTable('agent_anatomy_regions', {
  agentId: uuid('agent_id').references(() => clinicalAgents.id).notNull(),
  anatomicalRegionId: uuid('anatomical_region_id').references(() => anatomicalRegions.id).notNull(),
  relationshipType: text('relationship_type'),
}, (t) => ({
  pk: primaryKey({ columns: [t.agentId, t.anatomicalRegionId] }),
}));

export const evidenceSources = pgTable('evidence_sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  sourceName: text('source_name'),
  citation: text('citation'),
  uri: text('uri'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  retrievedAt: timestamp('retrieved_at', { withTimezone: true }).defaultNow(),
  metadata: jsonb('metadata'),
});

export const clinicalEvidence = pgTable('clinical_evidence', {
  id: uuid('id').primaryKey().defaultRandom(),
  consultationId: uuid('consultation_id').references(() => consultations.id).notNull(),
  agentRunId: uuid('agent_run_id').references(() => agentRuns.id),
  evidenceSourceId: uuid('evidence_source_id').references(() => evidenceSources.id).notNull(),
  relevanceScore: numeric('relevance_score'),
  confidenceLabel: text('confidence_label'),
  relationship: text('relationship'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const evidenceRelationships = pgTable('evidence_relationships', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceEvidenceId: uuid('source_evidence_id').references(() => clinicalEvidence.id).notNull(),
  targetEntityType: text('target_entity_type').notNull(),
  targetEntityId: uuid('target_entity_id').notNull(),
  relationshipType: text('relationship_type').notNull(),
  weight: numeric('weight'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ------------------------------------------------------------
// Triage & Audit
// ------------------------------------------------------------

export const triageAssessments = pgTable('triage_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  consultationId: uuid('consultation_id').references(() => consultations.id).notNull(),
  assessmentVersion: text('assessment_version'),
  severityLevel: text('severity_level').notNull(),
  urgencyLevel: text('urgency_level'),
  riskFactors: jsonb('risk_factors'),
  supportingEvents: jsonb('supporting_events'),
  uncertainties: jsonb('uncertainties'),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const clinicalStateSnapshots = pgTable('clinical_state_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  consultationId: uuid('consultation_id').references(() => consultations.id).notNull(),
  stateVersion: integer('state_version'),
  selectedRegionId: uuid('selected_region_id'),
  activeAgentIds: uuid('active_agent_ids').array(),
  activeEventIds: uuid('active_event_ids').array(),
  activeEvidenceIds: uuid('active_evidence_ids').array(),
  triageAssessmentId: uuid('triage_assessment_id').references(() => triageAssessments.id),
  state: jsonb('state'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'), // Firebase UID
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: uuid('entity_id'),
  requestId: text('request_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
