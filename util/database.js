import * as SQLite from "expo-sqlite";
import { Snap } from "../models/snap";

let database;

export async function initDatabase() {
  if (!database) {
    database = await SQLite.openDatabaseAsync("snaps.db");
  }
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS snaps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      imageUri TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Ubacivanje snap-a
export async function insertSnap(snap) {
  if (!database) {
    database = await SQLite.openDatabaseAsync("snaps.db");
  }
  // Snap instanca
  const snapObj = new Snap(
    snap.title,
    snap.description,
    snap.imageUri,
    snap.address,
    snap.latitude,
    snap.longitude,
    snap.createdAt ||
      new Date().toLocaleString("hr-HR", {
        timeZone: "Europe/Zagreb",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
  );
  const {
    title,
    description,
    imageUri,
    address,
    latitude,
    longitude,
    createdAt,
  } = snapObj;
  const result = await database.runAsync(
    `INSERT INTO snaps (title, description, imageUri, address, latitude, longitude, createdAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, imageUri, address, latitude, longitude, createdAt]
  );
  return result;
}

// Dohvaćanje svih snapova
export async function fetchSnaps() {
  if (!database) {
    database = await SQLite.openDatabaseAsync("snaps.db");
  }
  const rows = await database.getAllAsync("SELECT * FROM snaps");
  rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return rows.map(
    (row) =>
      new Snap(
        row.title,
        row.description,
        row.imageUri,
        row.address,
        row.latitude,
        row.longitude,
        row.createdAt
      )
  );
}

// brisanje snap-a
export async function deleteSnap(createdAt) {
  if (!database) {
    database = await SQLite.openDatabaseAsync("snaps.db");
  }
  const result = await database.runAsync(
    "DELETE FROM snaps WHERE createdAt = ?",
    [createdAt]
  );
  return result;
}

export async function updateSnap(snap) {
  if (!database) {
    database = await SQLite.openDatabaseAsync("snaps.db");
  }
  const {
    title,
    description,
    imageUri,
    address,
    latitude,
    longitude,
    createdAt,
  } = snap;
  const result = await database.runAsync(
    `UPDATE snaps SET title = ?, description = ?, imageUri = ?, address = ?, latitude = ?, longitude = ? 
     WHERE createdAt = ?`,
    [title, description, imageUri, address, latitude, longitude, createdAt]
  );
  return result;
}
