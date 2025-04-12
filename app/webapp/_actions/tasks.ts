"use server";

import { Task } from "@/lib/types";
import { getTaskDepth } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

// Single Operations
export async function createTask(taskInput: Task) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const taskToCreate = {
    ...taskInput,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("tasks")
    .insert(taskToCreate)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/tasks");
  return { data, error: null };
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
      .eq("user_id", user.id)
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
      .eq("user_id", user.id);

    if (error) throw error;
    revalidatePath("/tasks");
    return { error: null };
  } catch (err) {
    console.error("Error deleting task:", err);
    return { error: err instanceof Error ? err.message : "An error occurred" };
  }
}

// Batch Operations
export async function createBatchTasks(tasks: Task[]) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const tasksToCreate = tasks.map((task) => ({ ...task, user_id: user.id }));

    const { data, error } = await supabase
      .from("tasks")
      .insert(tasksToCreate)
      .select();

    if (error) throw error;
    revalidatePath("/tasks");
    return { data, error: null };
  } catch (err) {
    console.error("Error creating batch tasks:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "An error occurred",
    };
  }
}

export async function updateBatchTasks(tasks: Task[]) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase.from("tasks").upsert(tasks).select();

    if (error) throw error;
    revalidatePath("/tasks");
    return { data, error: null };
  } catch (err) {
    console.error("Error updating batch tasks:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "An error occurred",
    };
  }
}

export async function deleteBatchTasks(taskIds: string[]) {
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
      .in("id", taskIds)
      .eq("user_id", user.id);

    if (error) throw error;
    revalidatePath("/tasks");
    return { error: null };
  } catch (err) {
    console.error("Error deleting batch tasks:", err);
    return { error: err instanceof Error ? err.message : "An error occurred" };
  }
}

// Subtask handling remains the same
export async function addSubtask(parentTaskId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const [{ count }, { data: tasks }] = await Promise.all([
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("parent_task_id", parentTaskId),
      supabase.from("tasks").select().eq("user_id", user.id),
    ]);
    if (!tasks) throw new Error("Task cannot be created without parent task");

    const { error } = await supabase.from("tasks").insert([
      {
        id: uuidv4(),
        title: "",
        parent_task_id: parentTaskId,
        done: false,
        user_id: user.id,
        depth: getTaskDepth(tasks, parentTaskId),
        position: count || 0,
      },
    ]);

    if (error) throw error;
    revalidatePath("/tasks");
  } catch (err) {
    console.error("Error adding subtask: ", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "An error occurred",
    };
  }
}
