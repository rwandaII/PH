-- Partners: international or local, where they are, a short badge (e.g. "Principal donor"),
-- the organisation's office contacts and the people to contact (one per line).
ALTER TABLE `partners`
  ADD COLUMN `scope` VARCHAR(20) NOT NULL DEFAULT 'local',
  ADD COLUMN `place` VARCHAR(160) NOT NULL DEFAULT '',
  ADD COLUMN `badge` VARCHAR(60) NOT NULL DEFAULT '',
  ADD COLUMN `contacts` TEXT NOT NULL DEFAULT (''),
  ADD COLUMN `contact_people` TEXT NOT NULL DEFAULT ('');

-- Team members: years of work in the WASH domain and area of competence (Key technical team table).
ALTER TABLE `team_members`
  ADD COLUMN `wash_years` VARCHAR(40) NOT NULL DEFAULT '',
  ADD COLUMN `competence` VARCHAR(255) NOT NULL DEFAULT '';
