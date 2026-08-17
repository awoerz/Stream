---
id: TASK-0053
title: Implement image upload for tasks
type: task
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Add image upload capability for tasks, storing files in an `images` folder and generating IDs such as `img-task-0020-1`. Support uploading multiple images per task.## Acceptance Criteria
- Images uploaded via the UI are saved in an `images` directory on the server.
- Each image receives a unique ID formatted as `img-task-<taskId>-<sequence>`.
- The system correctly associates multiple images with the same task and displays them in the task view.
- Uploading a new image increments the sequence number for that task.

## Notes
* Ensure file size limits and MIME type checks are in place.  
* Update the task model to include an array of image IDs.  
* Add unit tests for ID generation and file storage logic.## Acceptance Criteria
- Images uploaded via the UI are saved in an `images` directory in the 1-stream project/
- Each image receives a unique ID formatted as `img-task-<taskId>-<sequence>`.
- The system correctly associates multiple images with the same task and displays them in the task view.
- Uploading a new image increments the sequence number for that task.

## Activity Log
- 2026-03-24: Added task-image upload support that stores files in `1-Stream/images`, appends image ids to task frontmatter, and returns image metadata for task detail rendering.
- 2026-03-24: Added focused tests for task-image id generation, validation, and file storage helpers.
- 2026-03-24: Verified the feature with `npm run test`, `npm run typecheck`, and `npm run build`.
