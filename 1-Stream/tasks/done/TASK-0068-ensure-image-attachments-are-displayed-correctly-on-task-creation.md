---
id: TASK-0068
title: Ensure image attachments are displayed correctly on task creation.
type: task
priority: medium
rank: 1
created: 2024-02-29
updated: 2026-04-09
---

## Summary
Verify that image attachments can be successfully uploaded and displayed within new task creation forms.

## Acceptance Criteria
- Image uploads are successful when a file is selected in the task creation form.
- Uploaded images are displayed correctly within the task details view after task creation.
- Images display with appropriate dimensions and aspect ratio, preventing distortion or cropping.
- The upload process is responsive and does not cause the task creation form to freeze.

## Notes
Investigate potential issues with file size limits, supported image formats, and browser compatibility.  Consider adding a visual indicator during upload to provide feedback to the user.

## Activity Log
- 2026-04-08: Added create-mode image attachment support to the task form so users can select multiple PNG, JPEG, WEBP, or GIF files before saving a new task.
- 2026-04-08: Added local preview cards for pending task images and made the create flow upload those files immediately after the task markdown is created.
- 2026-04-08: Updated task-detail image rendering to preserve aspect ratio with `object-fit: contain` instead of the previous cropped display.
