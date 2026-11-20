-- What visitors say about the programme; shown after staff approve it.
CREATE TABLE `testimonials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `place` VARCHAR(160) NOT NULL DEFAULT '',
    `message` TEXT NOT NULL,
    `is_approved` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `testimonials_is_approved_created_at_idx`(`is_approved`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
