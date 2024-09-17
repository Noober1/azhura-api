/*
  Warnings:

  - A unique constraint covering the columns `[word]` on the table `Kotoba` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `kotoba` MODIFY `explanation` VARCHAR(191) NULL DEFAULT 'Tidak ada penjelasan';

-- CreateIndex
CREATE UNIQUE INDEX `Kotoba_word_key` ON `Kotoba`(`word`);
