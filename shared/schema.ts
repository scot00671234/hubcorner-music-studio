import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tracks = pgTable("tracks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  duration: integer("duration").notNull(), // in seconds
  filePath: text("file_path").notNull(),
  structure: json("structure").$type<{
    intro: { start: number; end: number };
    verse: { start: number; end: number };
    hook: { start: number; end: number };
    bridge: { start: number; end: number };
    outro: { start: number; end: number };
  }>().notNull(),
  settings: json("settings").$type<{
    bass: number;        // 0-100
    pace: number;        // 60-180 BPM  
    reverb: number;      // 0-100
    distortion: number;  // 0-100
    fadeIn: number;      // 0-10 seconds
    fadeOut: number;     // 0-10 seconds
    instruments: {
      drums: boolean;
      bass: boolean;
      synths: boolean;
      pads: boolean;
      arps: boolean;
    };
    mood: string;        // dreamy, dark, uplifting, melancholic
  }>().default({
    bass: 50,
    pace: 85,
    reverb: 70,
    distortion: 20,
    fadeIn: 3,
    fadeOut: 3,
    instruments: {
      drums: true,
      bass: true,
      synths: true,
      pads: true,
      arps: false
    },
    mood: "dreamy"
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTrackSchema = createInsertSchema(tracks).omit({
  id: true,
  createdAt: true,
});

export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Track = typeof tracks.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
