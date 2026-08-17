import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

const maxTaskImageSizeBytes = 10 * 1024 * 1024;
const allowedMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif"
]);

function normalizeTaskImageTaskSegment(taskId: string) {
  const normalizedTaskId = taskId.trim();
  const taskMatch = normalizedTaskId.match(/^TASK-(\d+)$/i);
  const bugMatch = normalizedTaskId.match(/^BUG-(\d+)$/i);

  if (taskMatch) {
    return taskMatch[1];
  }

  if (bugMatch) {
    return `bug-${bugMatch[1]}`;
  }

  return normalizedTaskId.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function getNextTaskImageId(taskId: string, existingImageIds: string[]) {
  const taskSegment = normalizeTaskImageTaskSegment(taskId);
  const prefix = `img-task-${taskSegment}-`;
  const existingSequences = existingImageIds
    .map((imageId) => {
      const match = imageId.match(new RegExp(`^${prefix}(\\d+)$`));
      return match ? Number.parseInt(match[1], 10) : null;
    })
    .filter((value): value is number => value !== null);
  const nextSequence =
    existingSequences.length > 0 ? Math.max(...existingSequences) + 1 : 1;

  return `${prefix}${nextSequence}`;
}

export function validateTaskImageUpload(
  fileName: string,
  mimeType: string,
  sizeBytes: number
) {
  if (!allowedMimeTypes.has(mimeType)) {
    throw new Error(
      `Unsupported image type for ${fileName}. Use PNG, JPEG, WEBP, or GIF.`
    );
  }

  if (sizeBytes > maxTaskImageSizeBytes) {
    throw new Error(`${fileName} exceeds the 10 MB upload limit.`);
  }
}

function getTaskImageExtension(fileName: string, mimeType: string) {
  const extensionFromName = path.extname(fileName).toLowerCase();

  if (extensionFromName) {
    return extensionFromName;
  }

  switch (mimeType) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpg";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return "";
  }
}

export async function storeTaskImageFile(
  imagesDirectory: string,
  imageId: string,
  fileName: string,
  mimeType: string,
  base64Contents: string
) {
  await mkdir(imagesDirectory, { recursive: true });
  const extension = getTaskImageExtension(fileName, mimeType);
  const filePath = path.join(imagesDirectory, `${imageId}${extension}`);
  await writeFile(filePath, Buffer.from(base64Contents, "base64"), {
    encoding: "binary",
    flag: "wx"
  });
  return filePath;
}
