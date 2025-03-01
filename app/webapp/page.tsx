import { Calendar, ChevronDown, Inbox, LayoutGrid, Plus } from "lucide-react";
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
export default async function TaskApp() {

  return (
    <SidebarProvider>
      {/* Left Sidebar */}
      <Sidebar className="border-r-0 group/sidebar">
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
      <SidebarInset className="flex flex-col border-r border-[#ebebeb]">
        <header className="flex h-14 items-center gap-2 px-4 border-b border-[#ebebeb]">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-xl font-semibold">Today</h1>
        </header>

        <div className="p-4 flex-1">
          <div className="space-y-2">
            <div className={`p-3 rounded-lg flex items-center gap-3`}>
              <Checkbox id="task-1" className="border-muted-foreground" />
              <label htmlFor="task-1" className="font-medium cursor-pointer">
                Walk the Dog
              </label>
            </div>

            <div className="p-3 rounded-lg flex items-center gap-3">
              <Checkbox id="task-2" className="border-muted-foreground" />
              <label htmlFor="task-2" className="font-medium cursor-pointer">
                Preparation
              </label>
            </div>

            <div className="p-3 rounded-lg flex items-center gap-3">
              <Checkbox id="task-3" className="border-muted-foreground" />
              <label htmlFor="task-3" className="font-medium cursor-pointer">
                Getting the Dog Ready
              </label>
            </div>

            <div className="p-3 rounded-lg flex items-center gap-3">
              <Checkbox id="task-4" className="border-muted-foreground" />
              <label htmlFor="task-4" className="font-medium cursor-pointer">
                Make A Saas App
              </label>
            </div>
          </div>

          <button className="mt-4 flex items-center gap-2 text-muted-foreground px-3 py-2">
            <Plus className="w-4 h-4" />
            <span>Add task</span>
          </button>
        </div>
      </SidebarInset>

      {/* Right Sidebar - Task Details */}
      <Sidebar side="right" collapsible="none" className="w-80 border-l-0">
        <SidebarContent className="p-0">
          <header className="p-4 flex justify-between items-center border-b border-[#ebebeb]">
            <h2 className="text-xl font-semibold">Walk the Dog</h2>
            <Button variant="outline" size="sm" className="text-xs">
              Improve issue
            </Button>
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
                <Checkbox id="subtask-1" className="border-muted-foreground" />
                <label htmlFor="subtask-1" className="cursor-pointer">
                  Preparation
                </label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox id="subtask-2" className="border-muted-foreground" />
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
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
