/*
  Warnings:

  - You are about to drop the column `images` on the `imageInfo` table. All the data in the column will be lost.
  - Added the required column `image_name` to the `imageInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_size` to the `imageInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_type` to the `imageInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "imageInfo" DROP COLUMN "images",
ADD COLUMN     "image_name" TEXT NOT NULL,
ADD COLUMN     "image_size" INTEGER NOT NULL,
ADD COLUMN     "image_type" TEXT NOT NULL;
