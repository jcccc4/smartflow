import {
  Calendar,
  ChevronDown,
  CircleUser,
  Inbox,
  LayoutGrid,
} from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";

import { createClient } from "@/utils/supabase/server";
import TaskClient from "./_components/taskClient";
import { Task } from "@/lib/types";

export default async function TaskApp() {
  const supabase = await createClient();

  const { data }: { data: Task[] } = await supabase
    .from("tasks")
    .select()
    .order("created_at", { ascending: true })
    .then((result) => ({ data: result.data ?? [] }));
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error.message);
    return;
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r-0 group/sidebaR">
        <SidebarHeader className="p-0">
          <div className="p-4 flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              {user?.user_metadata.picture ? (
                <Image
                  src={user?.user_metadata?.picture}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              ) : (
                <CircleUser size={32} color="#a6acb4" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">
                {user?.user_metadata?.full_name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {user?.user_metadata?.email}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <form action="/auth/signout" method="post">
              <button className="button block" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-[#e7f0fe] p-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="bg-[#b4d1fb]">
                <LayoutGrid className="w-5 h-5" />
                <span>Today</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Calendar className="w-5 h-5" />
                <span>Upcoming</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Inbox className="w-5 h-5" />
                <span>Inbox</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail className="group-hover/sidebar:after:bg-border" />
      </Sidebar>

      <SidebarInset className="flex flex-col border-r border-[#ebebeb]  min-h-svh">
        <header className="flex h-14 items-center gap-2 px-4 border-b border-[#ebebeb]">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-xl font-semibold">Today</h1>
        </header>

        <TaskClient taskList={data} />
      </SidebarInset>
    </SidebarProvider>
  );
}
