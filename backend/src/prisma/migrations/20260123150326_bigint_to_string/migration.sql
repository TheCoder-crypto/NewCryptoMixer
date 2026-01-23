/*
  Warnings:

  - The primary key for the `Family` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Family" DROP CONSTRAINT "Family_pkey",
ALTER COLUMN "leaf" DROP DEFAULT,
ALTER COLUMN "leaf" SET DATA TYPE TEXT,
ALTER COLUMN "sibling1" SET DATA TYPE TEXT,
ALTER COLUMN "sibling2" SET DATA TYPE TEXT,
ALTER COLUMN "sibling3" SET DATA TYPE TEXT,
ALTER COLUMN "sibling4" SET DATA TYPE TEXT,
ALTER COLUMN "sibling5" SET DATA TYPE TEXT,
ALTER COLUMN "sibling6" SET DATA TYPE TEXT,
ALTER COLUMN "sibling7" SET DATA TYPE TEXT,
ADD CONSTRAINT "Family_pkey" PRIMARY KEY ("leaf");
DROP SEQUENCE "Family_leaf_seq";
