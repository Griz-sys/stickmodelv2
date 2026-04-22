-- AlterTable users: add profile fields
ALTER TABLE "users" ADD COLUMN "designation" TEXT;
ALTER TABLE "users" ADD COLUMN "companyName" TEXT;
ALTER TABLE "users" ADD COLUMN "companyEmail" TEXT;
ALTER TABLE "users" ADD COLUMN "companyWebsite" TEXT;
ALTER TABLE "users" ADD COLUMN "phone" TEXT;
ALTER TABLE "users" ADD COLUMN "location" TEXT;
ALTER TABLE "users" ADD COLUMN "billingAddress" TEXT;
ALTER TABLE "users" ADD COLUMN "billingContactName" TEXT;
ALTER TABLE "users" ADD COLUMN "billingContactPhone" TEXT;
ALTER TABLE "users" ADD COLUMN "referralSource" TEXT;
ALTER TABLE "users" ADD COLUMN "referralDetail" TEXT;

-- AlterTable otp_verifications: add extended invite fields
ALTER TABLE "otp_verifications" ADD COLUMN "designation" TEXT;
ALTER TABLE "otp_verifications" ADD COLUMN "companyEmail" TEXT;
ALTER TABLE "otp_verifications" ADD COLUMN "phone" TEXT;
ALTER TABLE "otp_verifications" ADD COLUMN "location" TEXT;
ALTER TABLE "otp_verifications" ADD COLUMN "billingAddress" TEXT;
ALTER TABLE "otp_verifications" ADD COLUMN "billingContactName" TEXT;
ALTER TABLE "otp_verifications" ADD COLUMN "billingContactPhone" TEXT;
ALTER TABLE "otp_verifications" ADD COLUMN "referralSource" TEXT;
ALTER TABLE "otp_verifications" ADD COLUMN "referralDetail" TEXT;
