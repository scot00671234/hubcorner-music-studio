import { type User, type InsertUser, type Track, type InsertTrack } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getTrack(id: string): Promise<Track | undefined>;
  getTracks(limit?: number): Promise<Track[]>;
  createTrack(track: InsertTrack): Promise<Track>;
  deleteTrack(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tracks: Map<string, Track>;

  constructor() {
    this.users = new Map();
    this.tracks = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTrack(id: string): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async getTracks(limit: number = 10): Promise<Track[]> {
    const tracks = Array.from(this.tracks.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    return tracks;
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const id = randomUUID();
    const defaultSettings = {
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
    };
    
    const track: Track = { 
      ...insertTrack,
      settings: insertTrack.settings || defaultSettings,
      id, 
      createdAt: new Date()
    };
    this.tracks.set(id, track);
    return track;
  }

  async deleteTrack(id: string): Promise<boolean> {
    return this.tracks.delete(id);
  }
}

export const storage = new MemStorage();
