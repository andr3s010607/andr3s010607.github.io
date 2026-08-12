import { readdir } from 'node:fs/promises';
import { extname, join, relative, sep } from 'node:path';

export const EVIDENCE_CATEGORIES = [
  {
    id: 'modelado',
    title: 'Modelado',
    description: 'Diagramas, modelos entidad-relación y documentación de diseño.',
  },
  {
    id: 'normalizacion',
    title: 'Normalización',
    description: 'Ejercicios y documentos sobre organización y consistencia de datos.',
  },
  {
    id: 'sql',
    title: 'SQL',
    description: 'Scripts, consultas, prácticas y capturas relacionadas.',
  },
  {
    id: 'proyecto',
    title: 'Proyecto',
    description: 'Entregables y avances integradores del proyecto.',
  },
] as const;

export type EvidenceCategory = (typeof EVIDENCE_CATEGORIES)[number];
export type EvidenceCategoryId = EvidenceCategory['id'];

export type Evidence = {
  category: EvidenceCategoryId;
  title: string;
  type: string;
  extension: string;
  url: string;
  isImage: boolean;
  canPreview: boolean;
};

const publicEvidenceDirectory = join(process.cwd(), 'public', 'evidencias');
const ignoredFiles = new Set(['.gitkeep', '.ds_store', 'thumbs.db']);
const imageExtensions = new Set([
  '.avif',
  '.gif',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.webp',
]);
const previewableExtensions = new Set([
  ...imageExtensions,
  '.pdf',
  '.sql',
  '.txt',
  '.csv',
  '.json',
  '.md',
]);
const typeLabels: Record<string, string> = {
  '.avif': 'Imagen AVIF',
  '.csv': 'Archivo CSV',
  '.doc': 'Documento Word',
  '.docx': 'Documento Word',
  '.gif': 'Imagen GIF',
  '.jpeg': 'Imagen JPEG',
  '.jpg': 'Imagen JPEG',
  '.json': 'Archivo JSON',
  '.md': 'Documento Markdown',
  '.pdf': 'Documento PDF',
  '.png': 'Imagen PNG',
  '.ppt': 'Presentación',
  '.pptx': 'Presentación',
  '.sql': 'Script SQL',
  '.svg': 'Imagen SVG',
  '.txt': 'Archivo de texto',
  '.webp': 'Imagen WebP',
  '.xls': 'Hoja de cálculo',
  '.xlsx': 'Hoja de cálculo',
  '.zip': 'Archivo ZIP',
};

function isIgnored(name: string) {
  return name.startsWith('.') || ignoredFiles.has(name.toLowerCase());
}

async function filesIn(directory: string): Promise<string[]> {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        if (isIgnored(entry.name) || entry.isSymbolicLink()) {
          return [];
        }

        const fullPath = join(directory, entry.name);
        if (entry.isDirectory()) {
          return filesIn(fullPath);
        }

        return entry.isFile() ? [fullPath] : [];
      }),
    );

    return files.flat();
  } catch {
    return [];
  }
}

function titleFromFile(relativeFilePath: string) {
  const withoutExtension = relativeFilePath.replace(/\.[^/.]+$/, '');
  return withoutExtension
    .split(/[\\/]/)
    .map((part) =>
      part
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^./, (character) => character.toLocaleUpperCase('es')),
    )
    .filter(Boolean)
    .join(' · ');
}

function urlFromFile(category: EvidenceCategoryId, relativeFilePath: string) {
  const segments = ['evidencias', category, ...relativeFilePath.split(sep)];
  return '/' + segments.map((segment) => encodeURIComponent(segment)).join('/');
}

async function getCategoryEvidences(
  category: EvidenceCategory,
): Promise<Evidence[]> {
  const categoryDirectory = join(publicEvidenceDirectory, category.id);
  const files = await filesIn(categoryDirectory);

  return files
    .map((file) => {
      const relativeFilePath = relative(categoryDirectory, file);
      const extension = extname(file).toLowerCase();

      return {
        category: category.id,
        title: titleFromFile(relativeFilePath),
        type:
          typeLabels[extension] ||
          'Archivo ' + (extension.slice(1).toUpperCase() || 'sin extensión'),
        extension,
        url: urlFromFile(category.id, relativeFilePath),
        isImage: imageExtensions.has(extension),
        canPreview: previewableExtensions.has(extension),
      };
    })
    .sort((first, second) => first.title.localeCompare(second.title, 'es'));
}

export async function getEvidencesByCategory() {
  const entries = await Promise.all(
    EVIDENCE_CATEGORIES.map(async (category) =>
      [category.id, await getCategoryEvidences(category)] as const,
    ),
  );

  return Object.fromEntries(entries) as Record<EvidenceCategoryId, Evidence[]>;
}
