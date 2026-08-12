import { access } from 'node:fs/promises';
import { join } from 'node:path';

const publicDirectory = join(process.cwd(), 'public', 'assets');
const avatarCandidates = [
  'avatar.jpg',
  'avatar.jpeg',
  'avatar.png',
  'avatar.webp',
  'avatar.avif',
];

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Estas comprobaciones ocurren únicamente durante el build de Astro. GitHub
 * Pages recibe HTML estático y no necesita ningún backend para mostrar los
 * archivos agregados al repositorio antes de publicar.
 */
export async function getPortfolioAssets() {
  const avatar = await Promise.all(
    avatarCandidates.map(async (filename) => ({
      filename,
      exists: await exists(join(publicDirectory, 'img', filename)),
    })),
  );

  const avatarFile = avatar.find((file) => file.exists)?.filename;
  const hasPresentationVideo = await exists(
    join(publicDirectory, 'video', 'presentacion.mp4'),
  );

  return {
    avatarUrl: avatarFile ? '/assets/img/' + avatarFile : undefined,
    videoUrl: hasPresentationVideo
      ? '/assets/video/presentacion.mp4'
      : undefined,
  };
}
