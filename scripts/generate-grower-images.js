const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dataRoot = path.join(root, 'data');
const growersPath = path.join(dataRoot, 'growers.json');
const imageRoot = path.join(root, 'assets', 'images', 'growers');
const outputPath = path.join(dataRoot, 'grower-images.json');
const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);
const maxImagesPerGrower = 10;

async function findImages(directory, growerDirectory = directory) {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }

  const images = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      images.push(...await findImages(fullPath, growerDirectory));
    } else if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      const relativePath = path.relative(root, fullPath).split(path.sep).join('/');
      const captionKey = path.relative(growerDirectory, fullPath).split(path.sep).join('/');
      const alt = path.basename(entry.name, path.extname(entry.name))
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      images.push({ src: relativePath, alt: alt || 'Coffee estate photograph', captionKey });
    }
  }

  return images.sort((left, right) => left.src.localeCompare(right.src));
}

async function readCaptions(growerDirectory, imageFiles, growerSlug) {
  let contents;
  try {
    contents = await fs.readFile(path.join(growerDirectory, 'captions.json'), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }

  const captions = JSON.parse(contents);
  if (!captions || typeof captions !== 'object' || Array.isArray(captions)) {
    throw new Error(`Captions for "${growerSlug}" must be a JSON object mapping image paths to captions.`);
  }

  const imagePaths = new Set(imageFiles.map((image) => image.captionKey));
  for (const [imagePath, caption] of Object.entries(captions)) {
    if (
      !imagePaths.has(imagePath) ||
      typeof caption !== 'string' ||
      !caption.trim()
    ) {
      throw new Error(
        `Invalid image caption for "${growerSlug}" at "${imagePath}". Use an existing image path and a non-empty caption.`
      );
    }
  }

  return captions;
}

async function main() {
  const growers = JSON.parse(await fs.readFile(growersPath, 'utf8'));
  if (!Array.isArray(growers)) {
    throw new Error('growers.json must contain an array of grower profiles.');
  }

  const manifest = {};
  for (const grower of growers) {
    if (typeof grower.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(grower.slug)) {
      throw new Error('Every grower must have a valid slug before images can be generated.');
    }
    const growerDirectory = path.join(imageRoot, grower.slug);
    const imageFiles = await findImages(growerDirectory, growerDirectory);
    const captions = await readCaptions(growerDirectory, imageFiles, grower.slug);
    const images = imageFiles.map(({ captionKey, ...image }) => ({
      ...image,
      ...(captions[captionKey] ? { caption: captions[captionKey].trim() } : {})
    }));
    if (images.length > maxImagesPerGrower) {
      throw new Error(
        `Grower "${grower.slug}" has ${images.length} images; the maximum is ${maxImagesPerGrower}.`
      );
    }
    manifest[grower.slug] = images;
  }

  await fs.writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Generated grower image manifest for ${growers.length} grower(s).`);
}

main().catch((error) => {
  console.error('Unable to generate grower image manifest:', error);
  process.exitCode = 1;
});
