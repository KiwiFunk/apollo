ALTER TABLE "notes" RENAME TO "note_metadata";--> statement-breakpoint

CREATE TABLE "note_content" (
	"note_id" INTEGER PRIMARY KEY NOT NULL,
	"content" text
);
--> statement-breakpoint

ALTER TABLE "note_content" ADD CONSTRAINT "note_content_note_id_note_metadata_id_fk" FOREIGN KEY ("note_id") REFERENCES "note_metadata"("id") ON DELETE cascade;--> statement-breakpoint

-- DATA MIGRATION
INSERT INTO note_content (note_id, content)
SELECT id, content FROM note_metadata;
--> statement-breakpoint

ALTER TABLE "note_metadata" DROP COLUMN "content";--> statement-breakpoint