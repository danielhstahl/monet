import Home from "./Home";
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";


describe('Home', () => {
    test('it contains correct text', async () => {
        render(<MemoryRouter initialEntries={["/"]}><Home
            loginElement={<p>Hello</p>}
        /></MemoryRouter>
        )
        const home = await screen.findByText("Home");
        expect(home).toBeInTheDocument();
        const metrics = await screen.findByText("Metrics");
        expect(metrics).toBeInTheDocument();
        const apikey = await screen.findByText("Api Key");
        expect(apikey).toBeInTheDocument();
    })

})