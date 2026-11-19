-- CreateTable
CREATE TABLE `services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(120) NOT NULL,
    `slug` VARCHAR(140) NOT NULL,
    `summary` VARCHAR(500) NOT NULL DEFAULT '',
    `includes` TEXT NOT NULL DEFAULT (''),
    `details` TEXT NOT NULL DEFAULT (''),
    `photo` VARCHAR(255) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `services_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

