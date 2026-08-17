"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = require("node:fs/promises");
const taskImages_1 = require("./taskImages");
(0, node_test_1.default)("getNextTaskImageId increments from existing task images", () => {
    const imageId = (0, taskImages_1.getNextTaskImageId)("TASK-0020", [
        "img-task-0020-1",
        "img-task-0020-2"
    ]);
    strict_1.default.equal(imageId, "img-task-0020-3");
});
(0, node_test_1.default)("getNextTaskImageId falls back cleanly for bug ids", () => {
    const imageId = (0, taskImages_1.getNextTaskImageId)("BUG-0007", ["img-task-bug-0007-1"]);
    strict_1.default.equal(imageId, "img-task-bug-0007-2");
});
(0, node_test_1.default)("validateTaskImageUpload rejects unsupported mime types", () => {
    strict_1.default.throws(() => (0, taskImages_1.validateTaskImageUpload)("notes.txt", "text/plain", 128), /Unsupported image type/);
});
(0, node_test_1.default)("storeTaskImageFile writes the decoded file contents", async () => {
    const imagesDirectory = await (0, promises_1.mkdtemp)(node_path_1.default.join(node_os_1.default.tmpdir(), "stream-task-images-"));
    const filePath = await (0, taskImages_1.storeTaskImageFile)(imagesDirectory, "img-task-0020-1", "example.png", "image/png", Buffer.from("hello image", "utf8").toString("base64"));
    const contents = await (0, promises_1.readFile)(filePath, "utf8");
    strict_1.default.equal(contents, "hello image");
});
