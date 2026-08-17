import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, readFile } from "node:fs/promises";

import {
  getNextTaskImageId,
  storeTaskImageFile,
  validateTaskImageUpload
} from "./taskImages";

test("getNextTaskImageId increments from existing task images", () => {
  const imageId = getNextTaskImageId("TASK-0020", [
    "img-task-0020-1",
    "img-task-0020-2"
  ]);

  assert.equal(imageId, "img-task-0020-3");
});

test("getNextTaskImageId falls back cleanly for bug ids", () => {
  const imageId = getNextTaskImageId("BUG-0007", ["img-task-bug-0007-1"]);

  assert.equal(imageId, "img-task-bug-0007-2");
});

test("validateTaskImageUpload rejects unsupported mime types", () => {
  assert.throws(
    () => validateTaskImageUpload("notes.txt", "text/plain", 128),
    /Unsupported image type/
  );
});

test("storeTaskImageFile writes the decoded file contents", async () => {
  const imagesDirectory = await mkdtemp(path.join(os.tmpdir(), "stream-task-images-"));
  const filePath = await storeTaskImageFile(
    imagesDirectory,
    "img-task-0020-1",
    "example.png",
    "image/png",
    Buffer.from("hello image", "utf8").toString("base64")
  );
  const contents = await readFile(filePath, "utf8");

  assert.equal(contents, "hello image");
});
