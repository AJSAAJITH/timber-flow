-- 1. Create implicit join table for Many-to-Many relationship
CREATE TABLE IF NOT EXISTS "_BranchToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_BranchToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BranchToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "_BranchToUser_AB_unique" ON "_BranchToUser"("A", "B");
CREATE INDEX IF NOT EXISTS "_BranchToUser_B_index" ON "_BranchToUser"("B");

-- 2. Safe Data Transfer: Existing User.branchId connections are copied to the new join table
INSERT INTO "_BranchToUser" ("A", "B")
SELECT "branchId", "id"
FROM "User"
WHERE "branchId" IS NOT NULL
ON CONFLICT DO NOTHING;

-- 3. Drop old foreign key constraint and column safely
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_branchId_fkey";
ALTER TABLE "User" DROP COLUMN IF EXISTS "branchId";