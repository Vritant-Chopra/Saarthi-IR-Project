-- CreateTable
CREATE TABLE "userInfo" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "userInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imageInfo" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "upload_date" TIMESTAMP(3) NOT NULL,
    "images" JSONB NOT NULL,
    "key_value_pairs" JSONB NOT NULL,

    CONSTRAINT "imageInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userInfo_email_key" ON "userInfo"("email");
