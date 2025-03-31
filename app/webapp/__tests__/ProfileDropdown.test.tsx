import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskApp from "../page";
import ProfileDropdown from "../_components/profile/ProfileDropdown";

// Mock Supabase client
jest.mock("../../../utils/supabase/server", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockImplementation(() => ({
      select: jest.fn().mockImplementation(() => ({
        order: jest.fn().mockImplementation(() => ({
          then: jest.fn().mockImplementation(() => ({ data: [] })),
        })),
      })),
    })),
    auth: {
      getUser: jest.fn().mockImplementation(() => ({
        data: {
          user: {
            id: "test-user-id",
            user_metadata: {
              full_name: "Test User",
              email: "test@example.com",
              picture: "https://example.com/picture.jpg",
            },
          },
        },
        error: null,
      })),
    },
  })),
}));

describe("Profile Dropdown", () => {
  it("shows dropdown menu items when clicked", async () => {
    render(await TaskApp());

    // Click the dropdown trigger
    const trigger = screen.getByText("Test User").closest("button");
    if (trigger) {
      fireEvent(
        trigger,
        new PointerEvent("pointerdown", {
          bubbles: true,
          cancelable: true,
          composed: true,
        })
      );
    }

    // Check if dropdown menu items are displayed
    expect(screen.getByText("Profile Settings")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("displays default avatar when no profile picture is available", async () => {
    // Override the mock to return no picture
    const mockUser = {
      id: "test-user-id",
      app_metadata: {},
      aud: "authenticated",
      created_at: "2024-01-01T00:00:00.000Z",
      user_metadata: {
        full_name: "Test User",
        email: "test@example.com",
        picture: null,
      },
    };

    // Render the ProfileDropdown component directly instead of TaskApp
    render(<ProfileDropdown user={mockUser} />);
    // Check if the CircleUser icon is rendered instead of an image
    const fallbackIcon = screen.getByTestId("default-avatar");
    expect(fallbackIcon).toBeInTheDocument();
  });
});
