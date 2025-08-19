import { Router, type Request, type Response } from 'express';
import { VideosState } from './videosWatcher';

export function createVideosRouter(videosState: VideosState): Router {
  const router = Router();

  // GET /api/videos → lista actual
  router.get('/', (_req: Request, res: Response) => {
    res.json(videosState.getList());
  });

  // GET /api/videos/stream → SSE con cambios
  router.get('/stream', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // algunos entornos necesitan el flush explícito
    (res as any).flushHeaders?.();

    videosState.subscribe(res);
  });

  return router;
}
