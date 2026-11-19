-- CreateTable
CREATE TABLE `page_views` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `day` CHAR(10) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `visitor` CHAR(64) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `page_views_day_idx`(`day`),
    INDEX `page_views_day_visitor_idx`(`day`, `visitor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

