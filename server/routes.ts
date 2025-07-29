import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTrackSchema } from "@shared/schema";
import { MusicGenerator } from "./services/music-generator";
import { AudioProcessor } from "./services/audio-processor";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  const musicGenerator = new MusicGenerator();
  const audioProcessor = new AudioProcessor();

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!existsSync(uploadsDir)) {
    await fs.mkdir(uploadsDir, { recursive: true });
  }

  // Get all tracks
  app.get("/api/tracks", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const tracks = await storage.getTracks(limit);
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      res.status(500).json({ error: "Failed to fetch tracks" });
    }
  });

  // Get specific track
  app.get("/api/tracks/:id", async (req, res) => {
    try {
      const track = await storage.getTrack(req.params.id);
      if (!track) {
        return res.status(404).json({ error: "Track not found" });
      }
      res.json(track);
    } catch (error) {
      console.error("Error fetching track:", error);
      res.status(500).json({ error: "Failed to fetch track" });
    }
  });

  // Generate new song
  app.post("/api/generate", async (req, res) => {
    try {
      console.log("Starting song generation with custom settings...");
      const musicSettings = req.body || {};
      
      // Generate the song using AI with custom settings
      const { audioBuffer, metadata } = await musicGenerator.generateSong(musicSettings);
      
      // Process audio with Whitearmor-style effects
      const processedAudio = await audioProcessor.applyWhitearmorEffects(audioBuffer);
      
      // Save the processed audio file
      const fileName = `track_${Date.now()}.wav`;
      const filePath = path.join(uploadsDir, fileName);
      await fs.writeFile(filePath, processedAudio);
      
      // Create track record
      const trackData = {
        title: metadata.title,
        prompt: metadata.prompt,
        duration: metadata.duration,
        filePath: `/uploads/${fileName}`,
        structure: metadata.structure,
        settings: musicSettings,
      };

      const track = await storage.createTrack(trackData);
      
      res.json(track);
    } catch (error) {
      console.error("Error generating song:", error);
      res.status(500).json({ error: "Failed to generate song" });
    }
  });

  // Serve audio files
  app.get("/uploads/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(uploadsDir, filename);
      
      if (!existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }
      
      res.setHeader("Content-Type", "audio/wav");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.sendFile(filePath);
    } catch (error) {
      console.error("Error serving file:", error);
      res.status(500).json({ error: "Failed to serve file" });
    }
  });

  // Delete track
  app.delete("/api/tracks/:id", async (req, res) => {
    try {
      const track = await storage.getTrack(req.params.id);
      if (!track) {
        return res.status(404).json({ error: "Track not found" });
      }

      // Delete the audio file
      const fullPath = path.join(process.cwd(), track.filePath.substring(1));
      if (existsSync(fullPath)) {
        await fs.unlink(fullPath);
      }

      // Delete from storage
      await storage.deleteTrack(req.params.id);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting track:", error);
      res.status(500).json({ error: "Failed to delete track" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
