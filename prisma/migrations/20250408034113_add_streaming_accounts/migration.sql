-- CreateTable
CREATE TABLE "StreamingService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,

    CONSTRAINT "StreamingService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamingAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "maxUsers" INTEGER NOT NULL DEFAULT 5,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "StreamingAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StreamingService_name_key" ON "StreamingService"("name");

-- AddForeignKey
ALTER TABLE "StreamingAccount" ADD CONSTRAINT "StreamingAccount_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "StreamingService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "StreamingAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
