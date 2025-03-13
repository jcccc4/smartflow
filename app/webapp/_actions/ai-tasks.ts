import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
interface SuggestedTask {
  title: string;
  description: string;
}
interface Suggestion {
  subtasks: SuggestedTask[];
}

export async function suggestSubtasks(
  taskTitle: string,
  taskDescription?: string | null
) {
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Given the task "${taskTitle}" ${
      taskDescription ? `with description "${taskDescription}"` : ""
    }, 
    suggest 3-5 logical subtasks that would help complete this task. 
    Format the response as a JSON array of objects with 'title' and 'description' properties.
    Example format:
    {
      "subtasks": [
        {
          "title": "First subtask",
          "description": "Description of first subtask"
        }
      ]
    }
    Keep titles concise and actionable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const parsed: Suggestion = JSON.parse(jsonMatch[0]);

    return { suggestions: parsed.subtasks, error: null };
  } catch (error) {
    console.error("Error generating subtasks:", error);
    return {
      suggestions: null,
      error: "Failed to generate subtasks. Please try again.",
    };
  }
}
