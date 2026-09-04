-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('new', 'contacted', 'quoted', 'won', 'lost');

-- CreateTable
CREATE TABLE "setup_requests" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RequestStatus" NOT NULL DEFAULT 'new',
    "unread" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT '',
    "timeline" TEXT NOT NULL DEFAULT '',
    "budget" TEXT NOT NULL DEFAULT '',
    "services" TEXT[],
    "categoryNotes" JSONB NOT NULL DEFAULT '{}',
    "message" TEXT NOT NULL DEFAULT '',
    "adminNotes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "setup_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "setup_requests_createdAt_idx" ON "setup_requests"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "setup_requests_status_idx" ON "setup_requests"("status");
