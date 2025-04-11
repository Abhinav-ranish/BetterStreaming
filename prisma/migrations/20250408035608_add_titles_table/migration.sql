-- CreateTable
CREATE TABLE "Title" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Title_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Title" ADD CONSTRAINT "Title_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "StreamingService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
