-- AlterTable
ALTER TABLE `team_members` ADD COLUMN `address` VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN `email` VARCHAR(190) NOT NULL DEFAULT '',
    ADD COLUMN `expertise` VARCHAR(500) NOT NULL DEFAULT '',
    ADD COLUMN `phone` VARCHAR(60) NOT NULL DEFAULT '',
    ADD COLUMN `slug` VARCHAR(140) NULL;

-- CreateTable
CREATE TABLE `news_comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `news_id` INTEGER NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `message` TEXT NOT NULL,
    `is_approved` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `news_comments_news_id_is_approved_idx`(`news_id`, `is_approved`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `team_members_slug_key` ON `team_members`(`slug`);

-- AddForeignKey
ALTER TABLE `news_comments` ADD CONSTRAINT `news_comments_news_id_fkey` FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

