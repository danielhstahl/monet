import { LogInButtonWithAuth } from "./LogInButton";
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";

describe('LogInButtonWithAuth', () => {
    test('it shows login if logged out', () => {
        render(<MemoryRouter><LogInButtonWithAuth
            isAuthenticated={false}
            signOut={() => Promise.resolve()}
        /></MemoryRouter>
        )
        const button = screen.queryByText("Login");
        expect(button).toBeInTheDocument()
    })
    test('it shows logout if logged in', () => {
        render(<MemoryRouter><LogInButtonWithAuth
            isAuthenticated={false}
            signOut={() => Promise.resolve()}
        /></MemoryRouter>
        )
        const button = screen.queryByText("Login");
        expect(button).toBeInTheDocument()
    })
})