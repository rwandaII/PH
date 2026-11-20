-- Box of the organisational chart a team member belongs to.
ALTER TABLE `team_members` ADD COLUMN `category` VARCHAR(40) NOT NULL DEFAULT '';
