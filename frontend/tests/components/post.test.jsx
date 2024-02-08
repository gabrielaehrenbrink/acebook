import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import Post from "../../src/components/Post/Post.jsx";

describe("Post", () => {
  test("displays the message as an article", () => {
    const testPost = { _id: "123", message: "test message" };
    render(
      <Router>
        <Post post={testPost} token="" setNewPost=""/>
      </Router>
  );
    const article = screen.getByRole("article");
    expect(article.textContent).toBe("test message");
  });
});
