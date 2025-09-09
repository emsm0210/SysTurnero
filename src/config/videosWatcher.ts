// src/config/videosWatcher.ts (sin chokidar)
import * as fs from 'node:fs';
import * as path from 'node:path';
import mime from 'mime-types';
import type { Response } from 'express';

export interface VideoItem {
  name: string;
  src: string;       // /videos/<name>
  mtimeMs: number;
}

export const VIDEOS_DIR = path.join(__dirname, '../public/videos');
const ALLOWED_EXT = new Set(['.mp4', '.webm', '.ogv', '.ogg', '.mov', '.m4v']);

function isVideoFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  // Aceptamos por extensión conocida
  if (!ALLOWED_EXT.has(ext)) return false;
  // (Opcional) chequeo de MIME solo para log, no para bloquear
  const mt = mime.lookup(filePath) || '';
  if (!String(mt).startsWith('video/')) {
    console.warn(`[videos] aviso: ${path.basename(filePath)} tiene mime=${mt}, se acepta por extensión ${ext}`);
  }
  return true;
}

function readVideoList(): VideoItem[] {
  if (!fs.existsSync(VIDEOS_DIR)) return [];

  let entries: VideoItem[] = [];
  try {
    const dirents = fs.readdirSync(VIDEOS_DIR, { withFileTypes: true });
    console.log("[videos] dir entries =", dirents.map(d => d.name));

    for (const d of dirents) {
      const name = d.name;
      const full = path.join(VIDEOS_DIR, name);

      // Logs básicos por entrada
      const ext = path.extname(name).toLowerCase();
      const mt = mime.lookup(full) || "";
      console.log(`[videos] seen: "${name}" isFile=${d.isFile()} ext=${ext} mime=${mt}`);

      if (!d.isFile()) {
        console.log(`[videos] skip (not file): ${name}`);
        continue;
      }

      // 👉 volvemos a usar tu helper
      if (!isVideoFile(full)) {
        console.log(`[videos] skip (isVideoFile=false): ${name}`);
        continue;
      }

      try {
        const stat = fs.statSync(full);
        entries.push({
          name,
          src: `/videos/${encodeURIComponent(name)}`,
          mtimeMs: stat.mtimeMs,
        });
      } catch (e) {
        console.warn("[videos] stat fail (maybe in-use):", name, e);
      }
    }
  } catch (e) {
    console.error("[videos] readdir fail:", e);
  }

  // orden por fecha de modificación (o cambialo por localeCompare si querés alfabético)
  entries.sort((a, b) => a.mtimeMs - b.mtimeMs);
  console.log("[videos] result =", entries.map(i => i.name));
  return entries;
}

function debounce(fn: () => void, ms: number) {
  let t: NodeJS.Timeout | null = null;
  return () => {
    if (t) clearTimeout(t);
    t = setTimeout(fn, ms);
  };
}

export class VideosState {
  private list: VideoItem[] = [];
  private version = Date.now();
  private subscribers = new Set<Response>();
  private closeWatcher?: () => void;

  constructor() {
    if (!fs.existsSync(VIDEOS_DIR)) {
      fs.mkdirSync(VIDEOS_DIR, { recursive: true });
    }
    console.log("[videos] VIDEOS_DIR =", VIDEOS_DIR, "cwd=", process.cwd());
    this.list = readVideoList();
    console.log("[videos] boot list ->", this.list.map(v => v.name));
    this.version = Date.now();
    this.initWatcher(); // usa fs.watch
  }

  private refreshIfChanged = () => {
    const next = readVideoList();
    const changed = JSON.stringify(next) !== JSON.stringify(this.list);
    if (changed) {
      console.log("[videos] change detected. old:", this.list.map(v => v.name), "new:", next.map(v => v.name));
      this.list = next;
      this.version = Date.now();
      this.broadcast();
    } else {
      console.log("[videos] fs event but no diff.");
    }
  };

  private initWatcher(): void {
    // Algunos FS envían muchos eventos; aplicamos debounce
    const debounced = debounce(this.refreshIfChanged, 250);

    try {
      const watcher = fs.watch(VIDEOS_DIR, { persistent: true }, (_eventType, _filename) => {
        // events: 'rename' (add/remove), 'change'
        debounced();
      });

      this.closeWatcher = () => watcher.close();
    } catch (err) {
      console.error('fs.watch no disponible, fallback a polling:', err);
      this.initPolling();
    }
  }

  private initPolling(intervalMs = 2000): void {
    const timer = setInterval(this.refreshIfChanged, intervalMs);
    this.closeWatcher = () => clearInterval(timer);
  }

  public getList(): { version: number; videos: VideoItem[] } {
    return { version: this.version, videos: this.list };
  }

  public subscribe(res: Response): void {
    this.subscribers.add(res);
    this.send(res);
    res.on('close', () => {
      this.subscribers.delete(res);
    });
  }

  private send(res: Response): void {
    const payload = this.getList(); // 👈 objeto, no string
    console.log("[videos] SSE send ->", payload.videos.map(v => v.name));

    res.write("event: videos\n");
    res.write(`data: ${JSON.stringify(payload)}\n\n`); // 👈 acá sí va stringify
  }

  private broadcast(): void {
    for (const res of this.subscribers) this.send(res);
  }

  // Si querés cerrar al apagar la app:
  public dispose(): void {
    this.closeWatcher?.();
  }
}
