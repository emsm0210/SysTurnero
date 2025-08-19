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

export const VIDEOS_DIR = path.join(process.cwd(), 'public', 'videos');
const ALLOWED_EXT = new Set(['.mp4', '.webm', '.ogv', '.ogg', '.mov', '.m4v']);

function isVideoFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return false;
  const mt = mime.lookup(filePath);
  return !!mt && mt.startsWith('video/');
}

function readVideoList(): VideoItem[] {
  if (!fs.existsSync(VIDEOS_DIR)) return [];
  const entries = fs.readdirSync(VIDEOS_DIR)
    .map<VideoItem | null>((name) => {
      const full = path.join(VIDEOS_DIR, name);
      try {
        const stat = fs.statSync(full);
        if (stat.isFile() && isVideoFile(full)) {
          return { name, src: `/videos/${encodeURIComponent(name)}`, mtimeMs: stat.mtimeMs };
        }
      } catch { /* archivo pudo desaparecer en caliente */ }
      return null;
    })
    .filter((x): x is VideoItem => !!x)
    .sort((a, b) => a.mtimeMs - b.mtimeMs);
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
    this.list = readVideoList();
    this.version = Date.now();
    this.initWatcher(); // usa fs.watch
  }

  private refreshIfChanged = () => {
    const next = readVideoList();
    const changed = JSON.stringify(next) !== JSON.stringify(this.list);
    if (changed) {
      this.list = next;
      this.version = Date.now();
      this.broadcast();
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
    const payload = JSON.stringify(this.getList());
    res.write(`event: videos\n`);
    res.write(`data: ${payload}\n\n`);
  }

  private broadcast(): void {
    for (const res of this.subscribers) this.send(res);
  }

  // Si querés cerrar al apagar la app:
  public dispose(): void {
    this.closeWatcher?.();
  }
}
