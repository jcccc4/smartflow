import { suggestSubtasks } from "../_actions/ai-tasks";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Mock the entire module at the top level
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn(),
}));
describe("AI Tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("suggestSubtasks", () => {
    it("should return suggested subtasks for a given task", async () => {
      const taskTitle = "Create marketing plan";
      const mockGenerateContent = jest.fn().mockImplementation(() => ({
        response: {
          text: () =>
            JSON.stringify({
              error: null,
              subtasks: [
                {
                  title: "Suggested Subtask 1",
                  description: "Description 1",
                },
                {
                  title: "Suggested Subtask 2",
                  description: "Description 2",
                },
              ],
            }),
        },
      }));

      const mockGetGenerativeModel = jest.fn().mockImplementation(() => ({
        generateContent: mockGenerateContent,
      }));

      // Override the main mock for this test
      (GoogleGenerativeAI as jest.Mock).mockImplementationOnce(() => ({
        getGenerativeModel: mockGetGenerativeModel,
      }));
      const result = await suggestSubtasks(taskTitle);
      // First ensure suggestions exist and are not null

      expect(result.error).toBeNull();
      expect(result.suggestions).toBeDefined();
      expect(Array.isArray(result.suggestions)).toBe(true);

      // Now we can safely assert on the suggestions
      const suggestions = result.suggestions!;
      expect(suggestions).toHaveLength(2);
      expect(suggestions[0]).toHaveProperty("title", "Suggested Subtask 1");
      expect(suggestions[0]).toHaveProperty("description", "Description 1");
      expect(suggestions[1]).toHaveProperty("title", "Suggested Subtask 2");
      expect(suggestions[1]).toHaveProperty("description", "Description 2");
    });
    it("should return suggested subtasks for a given task", async () => {
      const taskTitle = "Create marketing plan";
      const taskDescription = "To identify and describe each step";
      const mockGenerateContent = jest.fn().mockImplementation(() => ({
        response: {
          text: () =>
            JSON.stringify({
              error: null,
              subtasks: [
                {
                  title: "Suggested Subtask 1",
                  description: "Description 1",
                },
                {
                  title: "Suggested Subtask 2",
                  description: "Description 2",
                },
              ],
            }),
        },
      }));

      const mockGetGenerativeModel = jest.fn().mockImplementation(() => ({
        generateContent: mockGenerateContent,
      }));

      // Override the main mock for this test
      (GoogleGenerativeAI as jest.Mock).mockImplementationOnce(() => ({
        getGenerativeModel: mockGetGenerativeModel,
      }));
      const result = await suggestSubtasks(taskTitle, taskDescription);
      // First ensure suggestions exist and are not null

      expect(result.error).toBeNull();
      expect(result.suggestions).toBeDefined();
      expect(Array.isArray(result.suggestions)).toBe(true);

      // Now we can safely assert on the suggestions
      const suggestions = result.suggestions!;
      expect(suggestions).toHaveLength(2);
      expect(suggestions[0]).toHaveProperty("title", "Suggested Subtask 1");
      expect(suggestions[0]).toHaveProperty("description", "Description 1");
      expect(suggestions[1]).toHaveProperty("title", "Suggested Subtask 2");
      expect(suggestions[1]).toHaveProperty("description", "Description 2");
    });
    it("should handle API errors gracefully", async () => {
      // Reset the mock implementation
      jest.clearAllMocks();
      // Mock API error
      // Mock the GoogleGenerativeAI implementation to throw an error
      const mockGenerateContent = jest.fn().mockImplementation(() => ({
        response: {
          text: () => {
            throw new Error("API Error");
          },
        },
      }));

      const mockGetGenerativeModel = jest.fn().mockImplementation(() => ({
        generateContent: mockGenerateContent,
      }));

      // Override the main mock for this test
      (GoogleGenerativeAI as jest.Mock).mockImplementationOnce(() => ({
        getGenerativeModel: mockGetGenerativeModel,
      }));
      const taskTitle = "Create marketing plan";
      const result = await suggestSubtasks(taskTitle);
      expect(result).toEqual({
        error: new Error("API Error"),
        suggestions: null,
      });
    });
  });

  it("should handle invalid JSON response format", async () => {
    jest.clearAllMocks();

    // Mock response with text that definitely contains no JSON object
    const mockGenerateContent = jest.fn().mockImplementation(() => ({
      response: {
        text: () => "plain text with no curly braces at all",
      },
    }));

    const mockGetGenerativeModel = jest.fn().mockImplementation(() => ({
      generateContent: mockGenerateContent,
    }));

    // Override the main mock for this test
    (GoogleGenerativeAI as jest.Mock).mockImplementationOnce(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    }));

    // Now this should properly throw an error since there's no JSON match
    const result = await suggestSubtasks("Test Task");
    expect(result).toEqual({
      error: new Error("Invalid response format"),
      suggestions: null,
    });
  });
});
