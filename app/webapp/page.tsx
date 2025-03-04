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
  const filteredTasksQuery = await supabase
    .from("tasks")
    .select()
    .order("created_at", { ascending: false });

  const { data }: { data: Task } = await supabase
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
      <SidebarInset className="flex flex-col border-r border-[#ebebeb]  ">
        <header className="flex h-14 items-center gap-2 px-4 border-b border-[#ebebeb]">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-xl font-semibold">Today</h1>
        </header>
        <div className="flex">
          <TaskClient tasks={data} />
          {/* Right Sidebar - Task Details */}
          <div className="border-l-0 w-1/3">
            <div className="p-0">
              <header className="p-4 flex justify-between items-center border-b border-[#ebebeb]">
                <h2 className="text-xl font-semibold">Walk the Dog</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      Improve issue
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator /> */}
                    <DropdownMenuItem className="w-[296px]">
                      <WandSparkles size={16} />
                      <span>Breakdown Item</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </header>

              <div className="p-4 border-b border-[#ebebeb]">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">≡</span>
                  <span className="text-sm">Add Description...</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold mb-4">Subtask</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="subtask-1"
                      className="border-muted-foreground"
                    />
                    <label htmlFor="subtask-1" className="cursor-pointer">
                      Preparation
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="subtask-2"
                      className="border-muted-foreground"
                    />
                    <label htmlFor="subtask-2" className="cursor-pointer">
                      Getting the Dog Ready
                    </label>
                  </div>
                </div>

                <button className="mt-4 flex items-center gap-2 text-muted-foreground px-1 py-1">
                  <Plus className="w-4 h-4" />
                  <span>Add task</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
