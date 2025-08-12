import { type SyntheticEvent, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDownRight, ImageOff, LoaderCircle } from "lucide-react";
import { UploadTask } from "prosekit/extensions/file";
import type { ImageAttrs } from "prosekit/extensions/image";
import type { ReactNodeViewProps } from "prosekit/react";
import { ResizableHandle, ResizableRoot } from "prosekit/react/resizable";

export default function ImageView(props: ReactNodeViewProps) {
  const { setAttrs, node } = props;
  const attrs = node.attrs as ImageAttrs;
  const url = attrs.src || "";
  const uploading = url.startsWith("blob:");

  const [aspectRatio, setAspectRatio] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!url.startsWith("blob:")) {
      return;
    }

    const uploadTask = UploadTask.get<string>(url);
    if (!uploadTask) {
      return;
    }

    const abortController = new AbortController();
    void uploadTask.finished
      .then(resultUrl => {
        if (resultUrl && typeof resultUrl === "string") {
          if (abortController.signal.aborted) {
            return;
          }
          setAttrs({ src: resultUrl });
        } else {
          if (abortController.signal.aborted) {
            return;
          }
          setError("Unexpected upload result");
        }
        UploadTask.delete(uploadTask.objectURL);
      })
      .catch(error => {
        if (abortController.signal.aborted) {
          return;
        }
        setError(String(error));
        UploadTask.delete(uploadTask.objectURL);
      });
    const unsubscribe = uploadTask.subscribeProgress(({ loaded, total }) => {
      if (abortController.signal.aborted) {
        return;
      }
      if (total > 0) {
        setProgress(loaded / total);
      }
    });
    return () => {
      unsubscribe();
      abortController.abort();
    };
  }, [url, setAttrs]);

  const handleImageLoad = (event: SyntheticEvent) => {
    const img = event.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = img;
    const ratio = naturalWidth / naturalHeight;
    if (ratio && Number.isFinite(ratio)) {
      setAspectRatio(ratio);
    }
    if (naturalWidth && naturalHeight && (!attrs.width || !attrs.height)) {
      setAttrs({ width: naturalWidth, height: naturalHeight });
    }
  };

  return (
    <ResizableRoot
      width={attrs.width ?? undefined}
      height={attrs.height ?? undefined}
      aspectRatio={aspectRatio}
      onResizeEnd={event => setAttrs(event.detail)}
      data-selected={props.selected ? "" : undefined}
      className="outline-solid group relative my-2 box-border flex max-h-[600px] min-h-[64px] min-w-[64px] max-w-full items-center justify-center overflow-hidden outline-2 outline-transparent data-[selected]:outline-blue-500"
    >
      {url && !error && (
        <Image
          src={url}
          width={attrs.width || 600}
          height={attrs.height || 400}
          onLoad={handleImageLoad}
          className="h-full max-h-full w-full max-w-full object-contain"
          alt="Image"
        />
      )}
      {uploading && !error && (
        <div className="absolute bottom-0 left-0 m-1 flex content-center items-center gap-2 rounded bg-gray-800/60 p-1.5 text-xs text-white/80 transition">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <div>{Math.round(progress * 100)}%</div>
        </div>
      )}
      {error && (
        <div className="@container absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center gap-4 bg-gray-200 p-2 text-sm dark:bg-gray-800">
          <ImageOff className="h-8 w-8" />
          <div className="@xs:block hidden opacity-80">Failed to upload image</div>
        </div>
      )}
      <ResizableHandle
        className="absolute bottom-0 right-0 m-1.5 rounded bg-gray-900/30 p-1 text-white/50 opacity-0 transition hover:bg-gray-800/60 hover:opacity-100 active:translate-x-0.5 active:translate-y-0.5 active:bg-gray-800/60 active:text-white/80 group-hover:opacity-100 group-[[data-resizing]]:opacity-100"
        position="bottom-right"
      >
        <ArrowDownRight className="h-4 w-4" />
      </ResizableHandle>
    </ResizableRoot>
  );
}
