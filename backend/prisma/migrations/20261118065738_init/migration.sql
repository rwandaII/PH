-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admins_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(220) NOT NULL,
    `excerpt` VARCHAR(500) NOT NULL DEFAULT '',
    `content` LONGTEXT NOT NULL,
    `cover_image` VARCHAR(255) NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `published_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `news_slug_key`(`slug`),
    INDEX `news_is_published_published_at_idx`(`is_published`, `published_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(220) NOT NULL,
    `summary` VARCHAR(500) NOT NULL DEFAULT '',
    `content` LONGTEXT NOT NULL,
    `cover_image` VARCHAR(255) NULL,
    `location` VARCHAR(200) NOT NULL DEFAULT '',
    `status` ENUM('planned', 'ongoing', 'completed') NOT NULL DEFAULT 'ongoing',
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `projects_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `role` VARCHAR(120) NOT NULL,
    `bio` TEXT NOT NULL DEFAULT (''),
    `photo` VARCHAR(255) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `partners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(160) NOT NULL,
    `logo` VARCHAR(255) NULL,
    `website_url` VARCHAR(255) NOT NULL DEFAULT '',
    `description` TEXT NOT NULL DEFAULT (''),
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_info` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `program_name` VARCHAR(160) NOT NULL DEFAULT 'Hydraulic Program',
    `tagline` VARCHAR(255) NOT NULL DEFAULT '',
    `hero_text` TEXT NOT NULL DEFAULT (''),
    `mission` TEXT NOT NULL DEFAULT (''),
    `vision` TEXT NOT NULL DEFAULT (''),
    `about_text` LONGTEXT NOT NULL DEFAULT (''),
    `contact_email` VARCHAR(190) NOT NULL DEFAULT '',
    `phone` VARCHAR(60) NOT NULL DEFAULT '',
    `address` VARCHAR(255) NOT NULL DEFAULT '',
    `facebook_url` VARCHAR(255) NOT NULL DEFAULT '',
    `twitter_url` VARCHAR(255) NOT NULL DEFAULT '',
    `linkedin_url` VARCHAR(255) NOT NULL DEFAULT '',
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `subject` VARCHAR(200) NOT NULL DEFAULT '',
    `message` TEXT NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
