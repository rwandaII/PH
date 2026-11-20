-- Pictures in the site's picture places (page-header sliders and single spots).
CREATE TABLE `site_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `place` VARCHAR(60) NOT NULL,
    `image` VARCHAR(255) NULL,
    `caption` VARCHAR(200) NOT NULL DEFAULT '',
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `site_images_place_sort_order_idx`(`place`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Where the office is (Contact page map).
ALTER TABLE `site_info` ADD COLUMN `map_link` VARCHAR(500) NOT NULL DEFAULT '',
    ADD COLUMN `latitude` VARCHAR(30) NOT NULL DEFAULT '',
    ADD COLUMN `longitude` VARCHAR(30) NOT NULL DEFAULT '',
    ADD COLUMN `street_view_url` TEXT NOT NULL DEFAULT ('');
