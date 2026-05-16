-- AlterTable
ALTER TABLE `AssignmentSubmission` ADD COLUMN `fileName` VARCHAR(191) NULL,
    ADD COLUMN `filePath` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `DiscussionMessage` ADD COLUMN `fileName` VARCHAR(191) NULL,
    ADD COLUMN `filePath` VARCHAR(191) NULL,
    ADD COLUMN `linkUrl` VARCHAR(191) NULL;
