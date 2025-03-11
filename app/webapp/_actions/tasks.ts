"use server";

import { Task } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
export async function createTask({ id, title }: { id: string; title: string }) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        id,
        title,
        user_id: user.id,
        done: false,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/tasks"); // Adjust the path as needed
  return data;
}

export async function addSubtask({
  id,
  parentTaskId,
}: {
  id: string;
  parentTaskId: string;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          id,
          title: "",
          parent_task_id: parentTaskId,
          done: false,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/tasks");
    return { data, error: null };
  } catch (err) {
    console.error("Error adding subtask:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "An error occurred",
    };
  }
}

export async function updateTask(task: Task) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("tasks")
      .update({ title: task.title })
      .eq("id", task.id)
      .eq("user_id", user.id) // Security: ensure user owns the task
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/tasks");
    return { data, error: null };
  } catch (err) {
    console.error("Error updating task:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "An error occurred",
    };
  }
}

export async function deleteTask({ id }: { id: string }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // Security: ensure user owns the task

    if (error) throw error;
    revalidatePath("/tasks");
    return { error: null };
  } catch (err) {
    console.error("Error deleting task:", err);
    return { error: err instanceof Error ? err.message : "An error occurred" };
  }
}
