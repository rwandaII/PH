-- The home page card beside the introduction, edited in Dashboard → Home page card.
ALTER TABLE `site_info`
  ADD COLUMN `feature_image` VARCHAR(255) NULL,
  ADD COLUMN `feature_title` VARCHAR(160) NOT NULL DEFAULT '',
  ADD COLUMN `feature_text` TEXT NOT NULL DEFAULT (''),
  ADD COLUMN `feature_button` VARCHAR(60) NOT NULL DEFAULT 'Read more',
  ADD COLUMN `feature_link` VARCHAR(500) NOT NULL DEFAULT '';
