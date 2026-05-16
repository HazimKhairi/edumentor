-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `identity` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NULL,
    `role` ENUM('Admin', 'Mentor', 'Mentee') NOT NULL,
    `status` ENUM('Active', 'Probation', 'Suspended') NOT NULL DEFAULT 'Active',
    `joined` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `semester` INTEGER NULL,
    `cgpa` DOUBLE NULL,
    `faceDescriptor` LONGBLOB NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_identity_key`(`identity`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `cohort` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `capacity` INTEGER NOT NULL,
    `enrolled` INTEGER NOT NULL DEFAULT 0,
    `pace` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `abstract` TEXT NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `sessions` INTEGER NOT NULL DEFAULT 0,
    `lecturerId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Course_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enrollment` (
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `asRole` ENUM('Mentor', 'Mentee') NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Enrollment_courseId_asRole_idx`(`courseId`, `asRole`),
    PRIMARY KEY (`userId`, `courseId`, `asRole`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PassedSubject` (
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `passedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`, `courseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassSession` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `room` VARCHAR(191) NOT NULL,
    `state` ENUM('Live', 'Scheduled', 'Closed') NOT NULL DEFAULT 'Scheduled',
    `format` ENUM('InPerson', 'Online', 'Hybrid') NOT NULL,
    `meetingLink` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttendanceSession` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `room` VARCHAR(191) NOT NULL,
    `expected` INTEGER NOT NULL,
    `present` INTEGER NOT NULL DEFAULT 0,
    `state` ENUM('Live', 'Scheduled', 'Closed') NOT NULL DEFAULT 'Scheduled',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenteeAttendance` (
    `sessionId` VARCHAR(191) NOT NULL,
    `menteeId` VARCHAR(191) NOT NULL,
    `menteeConfirmed` BOOLEAN NOT NULL DEFAULT false,
    `mentorVerified` BOOLEAN NOT NULL DEFAULT false,
    `recognisedAt` DATETIME(3) NULL,
    `verifiedAt` DATETIME(3) NULL,

    INDEX `MenteeAttendance_menteeId_idx`(`menteeId`),
    PRIMARY KEY (`sessionId`, `menteeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assignment` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `issued` DATETIME(3) NOT NULL,
    `due` DATETIME(3) NOT NULL,
    `weight` INTEGER NOT NULL,
    `status` ENUM('Open', 'ClosingSoon', 'Closed') NOT NULL DEFAULT 'Open',
    `submissions` INTEGER NOT NULL DEFAULT 0,
    `of_count` INTEGER NOT NULL DEFAULT 0,
    `type` VARCHAR(191) NOT NULL,
    `note` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiscussionRoom` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `starterId` VARCHAR(191) NOT NULL,
    `members` INTEGER NOT NULL DEFAULT 0,
    `posts` INTEGER NOT NULL DEFAULT 0,
    `pinned` BOOLEAN NOT NULL DEFAULT false,
    `excerpt` TEXT NOT NULL,
    `lastAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiscussionMessage` (
    `id` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeedbackEntry` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `mentorId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NULL,
    `score` DOUBLE NOT NULL,
    `n` INTEGER NOT NULL DEFAULT 1,
    `comment` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EvaluationRubric` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `target` VARCHAR(191) NOT NULL,
    `items` JSON NOT NULL,
    `scale` INTEGER NOT NULL DEFAULT 5,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_lecturerId_fkey` FOREIGN KEY (`lecturerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PassedSubject` ADD CONSTRAINT `PassedSubject_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PassedSubject` ADD CONSTRAINT `PassedSubject_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassSession` ADD CONSTRAINT `ClassSession_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceSession` ADD CONSTRAINT `AttendanceSession_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenteeAttendance` ADD CONSTRAINT `MenteeAttendance_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `AttendanceSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenteeAttendance` ADD CONSTRAINT `MenteeAttendance_menteeId_fkey` FOREIGN KEY (`menteeId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionRoom` ADD CONSTRAINT `DiscussionRoom_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionRoom` ADD CONSTRAINT `DiscussionRoom_starterId_fkey` FOREIGN KEY (`starterId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionMessage` ADD CONSTRAINT `DiscussionMessage_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `DiscussionRoom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionMessage` ADD CONSTRAINT `DiscussionMessage_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedbackEntry` ADD CONSTRAINT `FeedbackEntry_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedbackEntry` ADD CONSTRAINT `FeedbackEntry_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedbackEntry` ADD CONSTRAINT `FeedbackEntry_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
