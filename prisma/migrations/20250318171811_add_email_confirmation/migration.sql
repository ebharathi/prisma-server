-- AlterTable
ALTER TABLE `User` ADD COLUMN `confirmationToken` VARCHAR(191) NULL,
    ADD COLUMN `isConfirmed` BOOLEAN NOT NULL DEFAULT false;
