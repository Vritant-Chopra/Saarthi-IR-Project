-- CreateTable
CREATE TABLE "userInfo" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'normal',

    CONSTRAINT "userInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docInfo" (
    "doc_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "doc_link" TEXT NOT NULL,

    CONSTRAINT "docInfo_pkey" PRIMARY KEY ("doc_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userInfo_email_key" ON "userInfo"("email");
