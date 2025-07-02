-- CreateEnum
CREATE TYPE "Application_status" AS ENUM ('APPLIED', 'INTERVIEW', 'REJECTED', 'OFFER');

-- CreateTable
CREATE TABLE "users_info" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mail_id" TEXT NOT NULL,

    CONSTRAINT "users_info_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Application_infos" (
    "application_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "job_title" TEXT,
    "company_name" TEXT,
    "resume_used" TEXT,
    "cover_letter_used" TEXT,
    "status" "Application_status" NOT NULL DEFAULT 'APPLIED',
    "application_date" TIMESTAMP(3) NOT NULL,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_infos_pkey" PRIMARY KEY ("application_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_info_mail_id_key" ON "users_info"("mail_id");

-- AddForeignKey
ALTER TABLE "Application_infos" ADD CONSTRAINT "Application_infos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_info"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
