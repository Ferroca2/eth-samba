-- CreateEnum
CREATE TYPE "Chain" AS ENUM ('NEAR', 'SCROLL');

-- AlterTable
CREATE SEQUENCE protocol_id_seq;
ALTER TABLE "Protocol" ADD COLUMN     "chain" "Chain" NOT NULL DEFAULT 'NEAR',
ALTER COLUMN "id" SET DEFAULT nextval('protocol_id_seq');
ALTER SEQUENCE protocol_id_seq OWNED BY "Protocol"."id";
