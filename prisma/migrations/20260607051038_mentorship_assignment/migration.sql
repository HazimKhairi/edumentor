-- CreateTable
CREATE TABLE `MentorshipAssignment` (
    `menteeId` VARCHAR(191) NOT NULL,
    `mentorId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MentorshipAssignment_mentorId_courseId_idx`(`mentorId`, `courseId`),
    INDEX `MentorshipAssignment_courseId_idx`(`courseId`),
    PRIMARY KEY (`menteeId`, `courseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MentorshipAssignment` ADD CONSTRAINT `MentorshipAssignment_menteeId_fkey` FOREIGN KEY (`menteeId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MentorshipAssignment` ADD CONSTRAINT `MentorshipAssignment_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MentorshipAssignment` ADD CONSTRAINT `MentorshipAssignment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
