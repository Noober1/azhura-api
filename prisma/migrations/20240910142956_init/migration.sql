-- CreateTable
CREATE TABLE `Kotoba` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('TRANSITIVE', 'INTRANSITIVE', 'NOUN', 'NA_ADJECTIVE', 'I_ADJECTIVE') NOT NULL,
    `word` VARCHAR(30) NOT NULL,
    `hiragana` VARCHAR(30) NOT NULL,
    `meaning` VARCHAR(30) NOT NULL,
    `explanation` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
