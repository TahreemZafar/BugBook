"use client";

import Image from "next/image";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarUrl,
  size,
  className,
}: UserAvatarProps) {
  return (
    <Image
      src={avatarUrl || avatarPlaceholder}
      alt=" User avatar/Profile Image "
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square border border-gray-500/90 h-fit flex-none rounded-full  object-cover",
        className,
      )}
    />
  );
}
