-- CreateTable
CREATE TABLE "FinalData" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "upload_date" TIMESTAMP(3) NOT NULL,
    "image_name" TEXT NOT NULL,
    "image_size" TEXT NOT NULL,
    "image_type" TEXT NOT NULL,
    "key_value_pairs" JSONB NOT NULL,

    CONSTRAINT "FinalData_pkey" PRIMARY KEY ("id")
);
