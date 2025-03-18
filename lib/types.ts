import { Database } from "@/database.types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type OptimisticValueProp =
  | {
      type: "create" | "update" | "delete" | "suggest-subtasks";
      task: Task;
    }
  | {
      type: "sync";
      tasks: Task[];
    };
