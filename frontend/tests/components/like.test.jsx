import { render } from "@testing-library/react";
import { SignupPage } from "../../src/pages/Signup/SignupPage";
import { LoginPage } from "../../src/pages/Login/LoginPage"
import { useNavigate } from "react-router-dom";
import { likePost } from "../../src/services/posts";
import { BrowserRouter as Router } from 'react-router-dom';

const completeSignupForm = async () => {
    const user = userEvent.setup();
  
  
    const nameInputEl = screen.getByLabelText("Full name:")
    const emailInputEl = screen.getByLabelText("Email:");
    const passwordInputEl = screen.getByLabelText("Password:");
    const submitButtonEl = screen.getByRole("submit-button");
  
    await user.type(nameInputEl, "test user")
    await user.type(emailInputEl, "test@email.com");
    await user.type(passwordInputEl, "Password1!");
    await user.click(submitButtonEl);
}

const completeLoginForm = async () => {
    const user = userEvent.setup();

    const emailInputEl = screen.getByLabelText("Email:");
    const passwordInputEl = screen.getByLabelText("Password:");
    const submitButtonEl = screen.getByRole("submit-button");
  
    await user.type(emailInputEl, "test@email.com");
    await user.type(passwordInputEl, "Password1!");
    await user.click(submitButtonEl);
}

describe("Like and unlike posts", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    test("Signup and login a user", async () => {
        render(<Router>
        <SignupPage/>
      </Router>)
        try {
            const navigateMock = useNavigate();
            await completeSignupForm();
            expect(navigateMock).toHaveBeenCalledWith("/login");
            await completeLoginForm()
            expect(navigateMock).toHaveBeenCalledWith("/posts");
        } catch(error) {
            console.error("Signup failed", error)
        }
        
    })
})