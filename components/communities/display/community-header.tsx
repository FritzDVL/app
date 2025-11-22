import Image from "next/image";
import { Community } from "@/lib/domain/communities/types";
import { groveLensUrlToHttp } from "@/lib/shared/utils";

export function CommunityHeader({ community }: { community: Community }) {
  if (!community) return null;

  return (
    <>
      <div className="mb-6 bg-white px-4 py-6 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center">
              {community.group.metadata?.icon ? (
                <Image
                  src={groveLensUrlToHttp(community.group.metadata?.icon)}
                  alt={community.name}
                  width={60}
                  height={60}
                  className="h-[60px] w-[60px] object-contain"
                />
              ) : (
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-600">
                  {community.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{community.name}</h1>
              <p className="text-sm text-slate-500 dark:text-gray-400">{community.group.metadata?.description}</p>
            </div>
          </div>

          {/* Actions/Stats (Optional, can be removed if strictly following EthResearch which puts this elsewhere) */}
          <div className="mt-4 flex items-center gap-6 md:mt-0">{/* Keeping it minimal for now */}</div>
        </div>
      </div>
    </>
  );
}
