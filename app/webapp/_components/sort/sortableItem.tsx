"use client";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { cn } from "@/lib/utils";
import {
  attachInstruction,
  extractInstruction,
  Instruction,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
import { spacingTrigger } from "../tasks/taskItemList";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/tree-item";
import { OptimisticValueProp, Task } from "@/lib/types";
import { sortItems } from "./sort-items";
export function SortableItem({
  children,
  task,
  tasks,
  setOptimisticTaskState,
  className,
  style,
  ...props
}: {
  task: Task;
  tasks: Task[];
  setOptimisticTaskState: (action: OptimisticValueProp) => void;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const itemRef = useRef(null);
  const dragHandleRef = useRef(null);
  const [instruction, setInstruction] = useState<Instruction | null>(null);

  useEffect(() => {
    const element = itemRef.current;
    const dragHandle = dragHandleRef.current;
    if (!element || !dragHandle) return;

    return combine(
      draggable({
        element,
        dragHandle,
        getInitialData: () => ({ details: { ...task } }),
      }),
      dropTargetForElements({
        element,
        getData: ({ input, element }) => {
          // your base data you want to attach to the drop target
          const data = {
            details: { ...task },
          };
          // this will 'attach' the instruction to your `data` object
          return attachInstruction(data, {
            input,
            element,
            currentLevel: task.depth,
            indentPerLevel: spacingTrigger,
            mode: "last-in-group",
          });
        },
        onDrop: (args) => {
          const instruction: Instruction | null = extractInstruction(
            args.self.data
          );
          if (instruction?.type === "reparent") {
            console.log(instruction?.desiredLevel);
          }

          if (!instruction) return;
          sortItems(
            instruction,
            tasks,
            setOptimisticTaskState,
            args.source.data.details as Task,
            args.self.data.details as Task
          );
          setInstruction(null);
        },
        onDrag: (args) => {
          const instruction: Instruction | null = extractInstruction(
            args.self.data
          );
          setInstruction(instruction);
        },
        onDragLeave: () => {
          setInstruction(null);
        },
      })
    );
  }, []);

  return (
    <div
      ref={itemRef}
      style={{ paddingLeft: task.depth * spacingTrigger }}
      className={cn("grow flex relative items-center group h-16  ", className)}
      {...props}
    >
      <button
        ref={dragHandleRef}
        className="invisible  group-hover:visible w-5  "
      >
        <GripVertical
          size={12}
          className="stroke-[#666] hover:stroke-[#000] cursor-grab m-auto"
        />
      </button>
      {children}
      {instruction ? <DropIndicator instruction={instruction} /> : null}
    </div>
  );
}
