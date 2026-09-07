-- CreateTable
CREATE TABLE "images" (
    "slot" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "mimeType" TEXT NOT NULL,
    "bytes" BYTEA NOT NULL,
    "size" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("slot")
);
