-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "family";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "nullifiers";

-- CreateTable
CREATE TABLE "family"."Family" (
    "leaf" TEXT NOT NULL,
    "sibling1" TEXT NOT NULL,
    "sibling2" TEXT NOT NULL,
    "sibling3" TEXT NOT NULL,
    "sibling4" TEXT NOT NULL,
    "sibling5" TEXT NOT NULL,
    "sibling6" TEXT NOT NULL,
    "sibling7" TEXT NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("leaf")
);

-- CreateTable
CREATE TABLE "nullifiers"."Nullifiers" (
    "null_hash" TEXT NOT NULL,

    CONSTRAINT "Nullifiers_pkey" PRIMARY KEY ("null_hash")
);
