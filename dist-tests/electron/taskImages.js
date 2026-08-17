"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextTaskImageId = getNextTaskImageId;
exports.validateTaskImageUpload = validateTaskImageUpload;
exports.storeTaskImageFile = storeTaskImageFile;
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = require("node:fs/promises");
const maxTaskImageSizeBytes = 10 * 1024 * 1024;
const allowedMimeTypes = new Set([
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif"
]);
function normalizeTaskImageTaskSegment(taskId) {
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
function getNextTaskImageId(taskId, existingImageIds) {
    const taskSegment = normalizeTaskImageTaskSegment(taskId);
    const prefix = `img-task-${taskSegment}-`;
    const existingSequences = existingImageIds
        .map((imageId) => {
        const match = imageId.match(new RegExp(`^${prefix}(\\d+)$`));
        return match ? Number.parseInt(match[1], 10) : null;
    })
        .filter((value) => value !== null);
    const nextSequence = existingSequences.length > 0 ? Math.max(...existingSequences) + 1 : 1;
    return `${prefix}${nextSequence}`;
}
function validateTaskImageUpload(fileName, mimeType, sizeBytes) {
    if (!allowedMimeTypes.has(mimeType)) {
        throw new Error(`Unsupported image type for ${fileName}. Use PNG, JPEG, WEBP, or GIF.`);
    }
    if (sizeBytes > maxTaskImageSizeBytes) {
        throw new Error(`${fileName} exceeds the 10 MB upload limit.`);
    }
}
function getTaskImageExtension(fileName, mimeType) {
    const extensionFromName = node_path_1.default.extname(fileName).toLowerCase();
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
async function storeTaskImageFile(imagesDirectory, imageId, fileName, mimeType, base64Contents) {
    await (0, promises_1.mkdir)(imagesDirectory, { recursive: true });
    const extension = getTaskImageExtension(fileName, mimeType);
    const filePath = node_path_1.default.join(imagesDirectory, `${imageId}${extension}`);
    await (0, promises_1.writeFile)(filePath, Buffer.from(base64Contents, "base64"), {
        encoding: "binary",
        flag: "wx"
    });
    return filePath;
}
