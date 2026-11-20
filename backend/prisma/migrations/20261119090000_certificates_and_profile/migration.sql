-- About page: strategic objectives, governance and structure, and where the program works.
ALTER TABLE `site_info` ADD COLUMN `general_objective` TEXT NOT NULL DEFAULT (''),
    ADD COLUMN `specific_objectives` TEXT NOT NULL DEFAULT (''),
    ADD COLUMN `governance_text` TEXT NOT NULL DEFAULT (''),
    ADD COLUMN `areas_text` TEXT NOT NULL DEFAULT (''),
    ADD COLUMN `core_districts` VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN `other_districts` VARCHAR(255) NOT NULL DEFAULT '';

-- Certificates and appreciations.
CREATE TABLE `certificates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `kind` ENUM('certificate', 'appreciation') NOT NULL DEFAULT 'certificate',
    `issuer` VARCHAR(200) NOT NULL DEFAULT '',
    `issued_on` DATE NULL,
    `description` TEXT NOT NULL DEFAULT (''),
    `image` VARCHAR(255) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `certificates_is_published_kind_idx`(`is_published`, `kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
