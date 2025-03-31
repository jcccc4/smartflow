"use client";

import { CircleUser, ChevronDown } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";

interface ProfileDropdownProps {
  user: User;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 p-2 mb-2 rounded-md  hover:bg-white data-[state=open]:bg-white data-[state=open]:outline data-[state=open]:outline-1 transition-colors focus:outline-none">
        <div className="relative w-8 h-8 rounded-full flex-shrink-0">
          {user?.user_metadata?.picture ? (
            <Image
              src={user.user_metadata.picture}
              alt="Profile"
              width={32}
              height={32}
              className="object-cover rounded-full"
            />
          ) : (
            <div data-testid="default-avatar">
              <CircleUser size={32} color="#a6acb4" />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <h3 className="text-sm text-left font-medium overflow-hidden whitespace-nowrap text-ellipsis">
            {user.user_metadata.full_name}
          </h3>
          <p className="text-xs text-left text-muted-foreground">
            {user.user_metadata.email}
          </p>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[--radix-dropdown-menu-trigger-width] p-2"
      >
        <DropdownMenuItem>Profile Settings</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <form action="/auth/signout" method="post">
            <button className="w-full text-left" type="submit">
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
