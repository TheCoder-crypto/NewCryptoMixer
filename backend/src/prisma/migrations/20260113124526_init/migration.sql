-- CreateTable
CREATE TABLE "Family" (
    "leaf" BIGSERIAL NOT NULL,
    "sibling1" BIGINT NOT NULL,
    "sibling2" BIGINT NOT NULL,
    "sibling3" BIGINT NOT NULL,
    "sibling4" BIGINT NOT NULL,
    "sibling5" BIGINT NOT NULL,
    "sibling6" BIGINT NOT NULL,
    "sibling7" BIGINT NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("leaf")
);
