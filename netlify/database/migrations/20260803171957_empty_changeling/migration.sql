CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"password_hash" text,
	"provider" text DEFAULT 'email' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Add user_id as nullable first so existing trip rows don't cause a NOT NULL violation
ALTER TABLE "trips" ADD COLUMN "user_id" text;
--> statement-breakpoint

-- Create the owner account that will own all pre-existing trips
INSERT INTO "users" ("id", "first_name", "last_name", "email", "provider")
VALUES ('00000000-0000-0000-0000-000000000001', 'Elad', 'Asis', 'elad@vacationapp.local', 'email');
--> statement-breakpoint

-- Assign every existing trip to that owner account
UPDATE "trips" SET "user_id" = '00000000-0000-0000-0000-000000000001' WHERE "user_id" IS NULL;
--> statement-breakpoint

-- Now safe to enforce NOT NULL and add the foreign key
ALTER TABLE "trips" ALTER COLUMN "user_id" SET NOT NULL;
--> statement-breakpoint

ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
