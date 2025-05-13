/*
  Warnings:

  - Added the required column `imageInfoId` to the `FinalData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FinalData" ADD COLUMN     "imageInfoId" INTEGER NOT NULL,
ADD COLUMN     "image_data" TEXT;

-- AddForeignKey
ALTER TABLE "FinalData" ADD CONSTRAINT "FinalData_imageInfoId_fkey" FOREIGN KEY ("imageInfoId") REFERENCES "imageInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
