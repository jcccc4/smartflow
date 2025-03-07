import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const addTask = async (
  title: string,
  parentTaskId: number | null = null
) => {
  try {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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

export const handleUpdate = async (newTitle: string, id: number) => {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("tasks")
      .update({ title: newTitle })
      .eq("id", id);

    if (error) throw error;
    
  } catch (err) {
    console.error("Error updating task:", err);
    // Revert to original title on error
  }
};
