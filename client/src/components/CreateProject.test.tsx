import CreateProject from "./CreateProject";
import { fireEvent, render, screen } from '@testing-library/react';


describe('CreateProject', () => {
    test('it contains project name label', () => {
        const myfn = jest.fn()
        render(<CreateProject
            company="mycompany"
            loading={false}
            createProject={myfn}
        />
        )
        const input = screen.getByPlaceholderText("Project name");
        expect(input).toBeInTheDocument();
    })
    test('it submits project properly', async () => {
        const myfn = jest.fn()
        render(<CreateProject
            company="mycompany"
            loading={false}
            createProject={myfn}
        />
        )
        const input = screen.getByPlaceholderText("Project name");
        expect(input).toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'myproject' } })

        const button = await screen.findByText("Create Project")

        fireEvent.click(button)

        expect(myfn.mock.calls[0][0]).toEqual({ variables: { project_name: "myproject", company: "mycompany" } })
    })
})