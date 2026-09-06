-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "AwardNotice" (
  "id" TEXT NOT NULL, "buyerName" TEXT NOT NULL, "supplierName" TEXT NOT NULL,
  "cpvCode" TEXT NOT NULL, "value" DECIMAL(14,2), "awardDate" TIMESTAMP(3) NOT NULL,
  "sourceSystem" TEXT NOT NULL, "rawNoticeId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AwardNotice_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "TargetCompany" (
  "id" TEXT NOT NULL, "companyName" TEXT NOT NULL, "companiesHouseNumber" TEXT, "turnoverBand" TEXT, "sicCode" TEXT,
  "bidCount12m" INTEGER NOT NULL DEFAULT 0, "winCount12m" INTEGER NOT NULL DEFAULT 0, "lastBidDate" TIMESTAMP(3),
  "lastBidBuyer" TEXT, "lastBidOutcome" TEXT, "priorityScore" DECIMAL(5,2), "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TargetCompany_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Contact" (
  "id" TEXT NOT NULL, "companyId" TEXT NOT NULL, "fullName" TEXT NOT NULL, "roleTitle" TEXT NOT NULL, "roleTier" TEXT NOT NULL,
  "linkedinUrl" TEXT, "email" TEXT, "phone" TEXT, "source" TEXT NOT NULL, "verified" BOOLEAN NOT NULL DEFAULT false,
  "callStatus" TEXT NOT NULL DEFAULT 'not_contacted', "lastContactedAt" TIMESTAMP(3), "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "CallLog" (
  "id" TEXT NOT NULL, "contactId" TEXT NOT NULL, "outcome" TEXT NOT NULL, "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "CallLog_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ExpressionOfIntent" (
  "id" TEXT NOT NULL, "contactId" TEXT NOT NULL, "estimatedValue" DECIMAL(10,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'GBP', "confirmedAt" TIMESTAMP(3), "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "ExpressionOfIntent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AwardNotice_rawNoticeId_key" ON "AwardNotice"("rawNoticeId");
CREATE INDEX "AwardNotice_supplierName_idx" ON "AwardNotice"("supplierName");
CREATE INDEX "AwardNotice_cpvCode_idx" ON "AwardNotice"("cpvCode");
CREATE INDEX "TargetCompany_priorityScore_idx" ON "TargetCompany"("priorityScore");
CREATE INDEX "Contact_callStatus_idx" ON "Contact"("callStatus");
CREATE INDEX "Contact_roleTier_idx" ON "Contact"("roleTier");
CREATE UNIQUE INDEX "ExpressionOfIntent_contactId_key" ON "ExpressionOfIntent"("contactId");
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "TargetCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CallLog" ADD CONSTRAINT "CallLog_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExpressionOfIntent" ADD CONSTRAINT "ExpressionOfIntent_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
