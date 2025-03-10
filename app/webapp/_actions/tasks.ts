"use server";

import { OptimisticValueProp, Task } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTask(title: string) {
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
          title,
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
    console.error("Error creating task:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "An error occurred",
    };
  }
}

export async function addSubtask(parentTaskId: number) {
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

export async function deleteTask(id: number) {
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
