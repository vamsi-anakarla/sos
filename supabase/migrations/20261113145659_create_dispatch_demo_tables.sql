/*
# Create dispatch demo tables

Plain-English summary
This migration creates the storage for the RapidRelay dispatch demonstration: the ambulance fleet, the ambulance requests that arrive from each channel, and a running activity log of automated and manual dispatch actions. It also loads the sample fleet of seven fictional Bengaluru ambulances.

1. New Tables
- `ambulances`: fleet records (registration, operator, vehicle category, network, availability, area, last GPS time).
- `ambulance_requests`: requests from phone, WhatsApp, mobile app and API channels, with pickup, patient details, status, assigned ambulance, declined ambulances and external reference for duplicate protection.
- `dispatch_events`: time-stamped activity log linked to a request.

2. Seed data
- Seven sample ambulances with stable text identifiers (amb-1 to amb-7). All operators and registrations are fictional and labelled as samples.

3. Security
- Row level security is enabled on all three tables.
- This is a single-tenant public demonstration with no sign-in, so the anon and authenticated roles receive the minimum privileges needed: read and update fleet status, read and create requests, update request state, read and append activity.
- No DELETE privilege is granted on any table.

4. Important notes
- Sample data only. Nothing here connects to official emergency systems.
- Statements are idempotent so the migration can be safely re-applied.
*/

CREATE TABLE IF NOT EXISTS ambulances (
  id text PRIMARY KEY,
  registration text UNIQUE NOT NULL,
  operator text NOT NULL,
  category text NOT NULL CHECK (category IN ('BLS', 'ALS', 'Patient Transport')),
  network text NOT NULL CHECK (network IN ('private', 'government')),
  status text NOT NULL CHECK (status IN ('available', 'busy', 'out_of_service')),
  area text NOT NULL,
  last_gps_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ambulance_requests (
  id text PRIMARY KEY,
  channel text NOT NULL CHECK (channel IN ('Mobile app', 'Phone', 'WhatsApp', 'API')),
  network text NOT NULL CHECK (network IN ('private', 'government')),
  pickup_area text NOT NULL,
  pickup_note text NOT NULL,
  patient_name text NOT NULL,
  patient_phone text NOT NULL,
  patient_age integer,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('BLS', 'ALS', 'Patient Transport')),
  status text NOT NULL CHECK (status IN ('pending', 'assigned', 'accepted', 'en_route', 'on_scene', 'completed')),
  ambulance_id text REFERENCES ambulances(id) ON DELETE SET NULL,
  declined_ambulance_ids text[] NOT NULL DEFAULT '{}',
  alerts text[] NOT NULL DEFAULT '{}',
  ai_captured boolean NOT NULL DEFAULT false,
  external_ref text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  stage_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ambulance_requests_status ON ambulance_requests (status);
CREATE INDEX IF NOT EXISTS idx_ambulance_requests_ambulance ON ambulance_requests (ambulance_id);

CREATE TABLE IF NOT EXISTS dispatch_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id text REFERENCES ambulance_requests(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dispatch_events_created ON dispatch_events (created_at DESC);

INSERT INTO ambulances (id, registration, operator, category, network, status, area, last_gps_at) VALUES
  ('amb-1', 'KA-01-DEMO-101', 'Lifeline Care (Sample)', 'ALS', 'private', 'available', 'Jayanagar', now()),
  ('amb-2', 'KA-03-DEMO-202', 'CityMed Transport (Sample)', 'BLS', 'private', 'available', 'Koramangala', now()),
  ('amb-3', 'KA-05-DEMO-303', 'Sanjeevani Fleet (Sample)', 'ALS', 'private', 'available', 'Whitefield', now()),
  ('amb-4', 'KA-51-DEMO-404', 'Metro Response (Sample)', 'Patient Transport', 'private', 'available', 'Hebbal', now()),
  ('amb-5', 'KA-53-DEMO-505', 'Garden City Rescue (Sample)', 'BLS', 'private', 'available', 'BTM Layout', now()),
  ('amb-6', 'KA-41-DEMO-606', 'Tech Corridor Health (Sample)', 'ALS', 'private', 'out_of_service', 'Electronic City', now() - interval '35 minutes'),
  ('amb-7', 'KA-02-DEMO-707', 'Rajaji Medical Transport (Sample)', 'BLS', 'private', 'available', 'Rajajinagar', now())
ON CONFLICT (id) DO NOTHING;

ALTER TABLE ambulances ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambulance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_events ENABLE ROW LEVEL SECURITY;

GRANT SELECT, UPDATE ON ambulances TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON ambulance_requests TO anon, authenticated;
GRANT SELECT, INSERT ON dispatch_events TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_ambulances" ON ambulances;
CREATE POLICY "anon_select_ambulances" ON ambulances FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_ambulances" ON ambulances;
CREATE POLICY "anon_update_ambulances" ON ambulances FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_requests" ON ambulance_requests;
CREATE POLICY "anon_select_requests" ON ambulance_requests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_requests" ON ambulance_requests;
CREATE POLICY "anon_insert_requests" ON ambulance_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_requests" ON ambulance_requests;
CREATE POLICY "anon_update_requests" ON ambulance_requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_events" ON dispatch_events;
CREATE POLICY "anon_select_events" ON dispatch_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_events" ON dispatch_events;
CREATE POLICY "anon_insert_events" ON dispatch_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);
