-- CreateTable
CREATE TABLE "FederatedCredentials" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "subject" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FederatedCredentials_provider_subject_key" ON "FederatedCredentials"("provider", "subject");
