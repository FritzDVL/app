import React, { useEffect, useState } from "react";
import Image from "next/image";

interface LinkPreviewProps {
  url: string;
}

interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchMetadata = async () => {
      try {
        const res = await fetch(`/api/metadata/preview?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error("Failed to fetch metadata");
        const data = await res.json();
        if (!cancelled) {
          setMetadata(data);
        }
      } catch (err) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMetadata();

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (loading) {
    return (
      <div className="my-2 flex h-24 w-full animate-pulse rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div className="h-full w-24 bg-gray-200 dark:bg-gray-800" />
        <div className="flex-1 space-y-2 p-3">
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (error || !metadata || (!metadata.title && !metadata.description)) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-600 hover:underline dark:text-brand-400"
      >
        {url}
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group my-2 flex w-full max-w-2xl overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
    >
      {metadata.image && (
        <div className="relative h-auto w-32 flex-shrink-0 sm:w-48">
          <Image
            src={metadata.image}
            alt={metadata.title || "Link preview"}
            fill
            className="object-cover"
            unoptimized // For external images
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center p-4">
        {metadata.siteName && (
          <span className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">{metadata.siteName}</span>
        )}
        {metadata.title && (
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-brand-600 dark:text-gray-100 dark:group-hover:text-brand-400">
            {metadata.title}
          </h3>
        )}
        {metadata.description && (
          <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{metadata.description}</p>
        )}
      </div>
    </a>
  );
}
