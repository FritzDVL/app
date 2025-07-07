import { insertNode, union } from "prosekit/core";
import { defineFileDropHandler, defineFilePasteHandler } from "prosekit/extensions/file";

/**
 * Returns an extension that handles image file uploads when pasting or dropping
 * images into the editor. This is a scaffold for Grove uploads.
 */
export function defineImageFileHandlers() {
  return union(
    defineFilePasteHandler(({ view, file }) => {
      if (!file.type.startsWith("image/")) {
        return false;
      }
      // Start async upload to Grove
      // TODO: Pass file to uploadToGrove when implemented
      uploadToGrove(/* file */).then(url => {
        const command = insertNode({
          type: "image",
          attrs: { src: url },
        });
        command(view.state, view.dispatch, view);
      });
      return false;
    }),
    defineFileDropHandler(({ view, file, pos }) => {
      if (!file.type.startsWith("image/")) {
        return false;
      }
      // TODO: Pass file to uploadToGrove when implemented
      uploadToGrove(/* file */).then(url => {
        const command = insertNode({
          type: "image",
          attrs: { src: url },
          pos,
        });
        command(view.state, view.dispatch, view);
      });
      return false;
    }),
  );
}

// Scaffold for Grove upload logic
async function uploadToGrove(/* file: File */): Promise<string> {
  // TODO: Implement Grove upload logic here
  // Example:
  // const formData = new FormData();
  // formData.append("file", file);
  // const response = await fetch("/api/grove/upload", { method: "POST", body: formData });
  // if (!response.ok) throw new Error("Failed to upload to Grove");
  // const data = await response.json();
  // return data.url;
  throw new Error("Grove upload not implemented");
}
