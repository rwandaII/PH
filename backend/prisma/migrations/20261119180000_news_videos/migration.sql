-- A story can have an uploaded video and/or a video link (YouTube, Vimeo, Facebook).
ALTER TABLE `news` ADD COLUMN `video_file` VARCHAR(255) NULL,
    ADD COLUMN `video_url` VARCHAR(500) NOT NULL DEFAULT '';
