import { Calendar, Inbox, LayoutGrid } from "lucide-react";
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
import ProfileDropdown from "./_components/profile/ProfileDropdown";

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

  if (!user) {
    console.error("Error fetching user:");
    return;
  }
  return (
    <SidebarProvider>
      <Sidebar className="border-r-0 group/sidebar  bg-[#e7f0fe] p-3">
        <SidebarHeader className="p-0">
          <ProfileDropdown user={user} />
        </SidebarHeader>
        <SidebarContent className="p-0">
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
      </Sidebar>

      <SidebarInset className="flex flex-col border-r border-[#ebebeb] min-h-svh">
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
