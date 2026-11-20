-- The office location in words or a Plus Code (shown in the footer, Contact page and map).
ALTER TABLE `site_info` ADD COLUMN `location` VARCHAR(255) NOT NULL DEFAULT '';
