-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_golocation_id_fkey";

-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "golocation_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_golocation_id_fkey" FOREIGN KEY ("golocation_id") REFERENCES "geolocations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
