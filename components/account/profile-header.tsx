import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Account } from "@lens-protocol/client";
import { Calendar, LinkIcon, MapPin } from "lucide-react";

interface ProfileHeaderProps {
  lensAccount: Account;
  username: string;
}

export function ProfileHeader({ lensAccount, username }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden rounded-3xl md:h-64">
        {lensAccount?.metadata?.coverPicture ? (
          <>
            <Image
              src={lensAccount.metadata.coverPicture}
              alt="Cover"
              className="h-full w-full object-cover"
              width={300}
              height={100}
            />
            <div className="absolute inset-0 bg-green-900/20"></div>
          </>
        ) : (
          <>
            <div className="h-full w-full bg-gradient-to-r from-green-600 via-green-500 to-green-400"></div>
            <div className="absolute inset-0 bg-black/20"></div>
          </>
        )}
      </div>
      {/* Profile Info */}
      <div className="relative -mt-20 px-6">
        <div className="flex flex-col items-start space-y-4 md:flex-row md:items-end md:space-x-6 md:space-y-0">
          <Avatar className="h-32 w-32 border-4 border-white ring-2 ring-green-100">
            <AvatarImage src={lensAccount?.metadata?.picture || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-r from-green-400 to-green-600 text-4xl text-white">
              {(lensAccount?.metadata?.name || lensAccount?.username?.localName || username)[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 rounded-3xl border border-slate-300/60 bg-white/70 p-6 backdrop-blur-sm">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="mb-2 flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {lensAccount?.metadata?.name || lensAccount?.username?.localName || username}
                  </h1>
                </div>
                <p className="mb-2 font-medium text-green-600">@{lensAccount?.username?.localName || username}</p>
                <p className="max-w-2xl text-slate-700">{lensAccount?.metadata?.bio || "No bio available"}</p>
              </div>
            </div>
            {/* Stats Row */}
            <div className="mt-4 flex items-center space-x-6 border-t border-slate-200/60 pt-4">
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="mr-1 h-4 w-4" />
                {lensAccount?.createdAt
                  ? new Date(lensAccount.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
                  : "Unknown date"}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="mr-1 h-4 w-4" />
                {lensAccount?.metadata?.attributes?.find(attr => attr.key === "location" || attr.key === "city")
                  ?.value || "Location not set"}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <LinkIcon className="mr-1 h-4 w-4" />
                <a
                  href={
                    lensAccount?.metadata?.attributes?.find(attr => attr.key === "website" || attr.key === "url")
                      ?.value || "#"
                  }
                  className="text-green-600 hover:text-green-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {lensAccount?.metadata?.attributes?.find(attr => attr.key === "website" || attr.key === "url")
                    ?.value || "No website"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
