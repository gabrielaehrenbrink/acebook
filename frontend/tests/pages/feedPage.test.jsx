import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { FeedPage } from "../../src/pages/Feed/FeedPage";
import { getPosts } from "../../src/services/posts";
import { useNavigate } from "react-router-dom";

// Mocking the getPosts service
vi.mock("../../src/services/posts", () => {
  const getPostsMock = vi.fn();
  return { getPosts: getPostsMock };
});

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

describe("Feed Page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
  });

  test("It displays posts from the backend", async () => {
    window.localStorage.setItem("token", "testToken");

    const mockPosts = [
      { _id: "12345", message: "Test Post 1" },
      { _id: "67890", message: "Test Post 2" },
    ];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });

    render(<FeedPage />);

    // const posts = await screen.findAllByClassName("post");
    const posts = await screen.findAllByRole("article");
    expect(posts).toHaveLength(2);
    expect(posts[0].textContent).toEqual("Test Post 1");
    expect(posts[1].textContent).toEqual("Test Post 2");
  });

  test("It navigates to login if no token is present", async () => {
    render(<FeedPage />);
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("It displays posts in descending order (newest first)", async () => {
    window.localStorage.setItem("token", "testToken");

    const mockPosts = [
      { _id: "111", message: "Test Post 1" },
      { _id: "222", message: "Test Post 2" },
      { _id: "333", message: "Test Post 3" },
    ];

    // Mocking getPosts to return posts in a different order
    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });

    render(<FeedPage />);

    // const posts = await screen.findAllByClassName("post");
    const posts = await screen.findAllByRole("article");


    expect(posts).toHaveLength(3);
    expect(posts[0].textContent).toEqual("Test Post 1"); // Newest post should be first
    expect(posts[1].textContent).toEqual("Test Post 2");
    expect(posts[2].textContent).toEqual("Test Post 3");
  });
});