import {
  Calendar,
  ChevronDown,
  Inbox,
  LayoutGrid,
  Plus,
  WandSparkles,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/server";
import { Task } from "@/lib/types";
import { QueryData } from "@supabase/supabase-js";
import TaskClient from "./components/taskClient";

export default async function TaskApp() {
  const supabase = await createClient();
  // Initial data fetch
  const { data }: { data: Task[] } = await supabase
    .from("tasks")
    .select()
    .order("created_at", { ascending: false })
    .then((result) => ({ data: result.data ?? [] }));

  return (
    <SidebarProvider>
      {/* Left Sidebar */}
      <Sidebar className="border-r-0 group/sidebaR">
        <SidebarHeader className="p-0">
          <div className="p-4 flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Profile"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">Juan Dela Cruz</h3>
              <p className="text-xs text-muted-foreground">jdcruz@gmail.com</p>
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

      {/* Main Content */}
      <SidebarInset className="flex flex-col border-r border-[#ebebeb]  min-h-svh">
        <header className="flex h-14 items-center gap-2 px-4 border-b border-[#ebebeb]">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-xl font-semibold">Today</h1>
        </header>

        <TaskClient tasks={data} />
      </SidebarInset>
    </SidebarProvider>
  );
}
