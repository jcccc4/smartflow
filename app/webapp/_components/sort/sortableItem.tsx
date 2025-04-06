"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transition, setActivatorNodeRef } =
    useSortable({ id });

  const style = {
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex relative items-start"
      {...attributes}
    >
      <button ref={setActivatorNodeRef} className=" h-[43px]" {...listeners}>
        <GripVertical size={16} />
      </button>
      {children}
    </div>
  );
}
