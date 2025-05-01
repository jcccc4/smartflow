
import { updateTaskDescription } from "../_actions/tasks";

// Mock the necessary dependencies
jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => ({
        data: {
          user: { id: "test-user-id" }
        }
      }))
    },
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => ({
                data: { id: "task-id", description: "Updated description" },
                error: null
              }))
            }))
          }))
        }))
      }))
    }))
  }))
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn()
}));

describe("Task Description Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a task description", async () => {
    const result = await updateTaskDescription("task-id", "Updated description");
    
    expect(result).toEqual({
      data: { id: "task-id", description: "Updated description" },
      error: null
    });
  });
});