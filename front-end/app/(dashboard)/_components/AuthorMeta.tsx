"use client";

import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { apiGetBlob } from "@/app/lib/api";
import type { FeedUser } from "@/lib/types";

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "U";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function toHandle(name: string) {
  const compact = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  return `@${compact || "user"}`;
}

type AuthorMetaProps = {
  author?: FeedUser;
  createdISO: string;
};

export default function AuthorMeta({ author, createdISO }: AuthorMetaProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const clearObjectUrl = () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = null;
    };

    if (!author?.profileImageUrl) {
      clearObjectUrl();
      setAvatarUrl(null);
      return () => {
        clearObjectUrl();
      };
    }

    const loadAvatar = async () => {
      try {
        const blob = await apiGetBlob(author.profileImageUrl!);
        const nextObjectUrl = URL.createObjectURL(blob);
        clearObjectUrl();
        objectUrlRef.current = nextObjectUrl;
        if (isActive) {
          setAvatarUrl(nextObjectUrl);
        }
      } catch {
        clearObjectUrl();
        if (isActive) {
          setAvatarUrl(null);
        }
      }
    };

    void loadAvatar();

    return () => {
      isActive = false;
      clearObjectUrl();
    };
  }, [author?.profileImageUrl]);

  const displayName = author?.name?.trim() || "Unknown user";
  const handle = toHandle(displayName);
  const initials = getInitials(displayName);

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">{handle}</span>
          <span className="text-xs text-slate-500">
            {formatDistanceToNow(new Date(createdISO), { addSuffix: true })}
          </span>
        </div>
        <div className="truncate text-xs text-slate-500">{displayName}</div>
      </div>
    </div>
  );
}
