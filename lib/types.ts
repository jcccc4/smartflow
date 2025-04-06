import { Database } from "@/database.types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type OptimisticValueProp =
  | {
      type: "create" | "update" | "delete" | "sort";
      task: Task;
    }
  | {
      type: "batchCreate" | "batchUpdate" | "batchDelete";
      tasks: Task[];
    };
