import { Task } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const addTask = async (
  title: string,
  parentTaskId: number | null = null
) => {
  try {
    const { error } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          done: false,
          parent_task_id: parentTaskId,
          user_id: (await supabase.auth.getUser()).data.user?.id, // Replace with actual user ID
        },
      ])
      .select();

    if (error) throw error;
  } catch (err) {
    console.error("Error adding task:", err);
    // You might want to show an error message to the user here
  }
};

export const addSubtask = async (parentTaskId: number) => {
  try {
    const { error } = await supabase
      .from("tasks")
      .insert([
        {
          title: "",
          parent_task_id: parentTaskId,
          done: false,
          user_id: (await supabase.auth.getUser()).data.user?.id, // Replace with actual user ID
        },
      ])
      .select();

    if (error) throw error;
  } catch (err) {
    console.error("Error adding task:", err);
    // You might want to show an error message to the user here
  }
};

export const handleUpdate = async (task: Task) => {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("tasks")
      .update({ title: task.title })
      .eq("id", task.id);

    if (error) throw error;
  } catch (err) {
    console.error("Error updating task:", err);
  }
};

export const deleteTask = async (id: number) => {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) throw error;
  } catch (err) {
    console.error("Error deleting task:", err);
  }
};
