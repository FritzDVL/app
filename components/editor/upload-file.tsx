import { uploadImage } from "@/lib/external/grove/upload-image";
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
      uploadImage(file)
        .then(url => {
          const command = insertNode({
            type: "image",
            attrs: { src: url.gatewayUrl, width: 600, height: 400 },
          });
          command(view.state, view.dispatch, view);
        })
        .catch(error => {
          console.error("Failed to upload image:", error);
        });
      return true;
    }),
    defineFileDropHandler(({ view, file, pos }) => {
      if (!file.type.startsWith("image/")) {
        return false;
      }
      // TODO: Pass file to uploadToGrove when implemented
      uploadImage(file).then(url => {
        const command = insertNode({
          type: "image",
          attrs: { src: url.gatewayUrl, width: 600, height: 400 },
          pos,
        });
        command(view.state, view.dispatch, view);
      });
      return false;
    }),
  );
}
