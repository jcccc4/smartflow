"use server";

import { Task } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function createTasks(taskInput: Task | Task[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Convert single task to array if needed
  const tasksArray = Array.isArray(taskInput) ? taskInput : [taskInput];

  // Prepare the tasks array with required fields
  const tasksToCreate = tasksArray.map((task) => ({
    id: task.id,
    title: task.title,
    parent_task_id: task.parent_task_id,
    user_id: user.id,
    done: false,
    created_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from("tasks")
    .insert(tasksToCreate)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/tasks");
  return data;
}

export async function addSubtask(parentTaskId: string) {
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
          id: uuidv4(),
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

export async function deleteTask({ id }: Task) {
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
