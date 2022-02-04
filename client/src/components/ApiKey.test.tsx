import { render, screen } from '@testing-library/react';
import ApiKey, { ApiDisplay } from './ApiKey';
import { MockedProvider } from '@apollo/client/testing';
import { CREATE_API_KEY } from "../graphql/mutations"
import { GET_PROJECTS } from '../graphql/queries';

describe('ApiDisplay', () => {
    test('calls create api key on first load', async () => {
        let createApiKey = jest.fn()
        const getUser = () => Promise.resolve("user")
        const data = {
            addApiKey: {
                api_key: "api key"
            }
        }
        render(<ApiDisplay
            project_id={"123"}
            loading={false}
            createApiKey={createApiKey}
            getUser={getUser}
            data={data}
        />
        )
        const apikey = await screen.findByText(/api key/i);
        expect(apikey).toBeInTheDocument();
        expect(createApiKey.mock.calls.length).toEqual(1)
    })
    test('calls create api key once even if other parameters change on first load', () => {
        let createApiKey = jest.fn()
        const getUser = () => Promise.resolve("user")
        const data = {
            addApiKey: {
                api_key: "api key"
            }
        }
        const { container } = render(<ApiDisplay
            project_id={"123"}
            loading={true}
            createApiKey={createApiKey}
            getUser={getUser}
            data={data}
        />
        )
        expect(container.getElementsByClassName('ant-spin').length).toBe(1)
    })
})


describe('ApiKey', () => {
    test('It renders', () => {
        const getUser = () => Promise.resolve("user")
        const mocks = [
            {
                request: {
                    query: CREATE_API_KEY,
                    variables: {
                        user_id: 'user',
                        project_id: 'project'
                    },
                },
                result: {
                    data: {
                        addApiKey: { api_key: "my_api_key" },
                    },
                },
            },
            {
                request: {
                    query: GET_PROJECTS,
                    variables: {
                        company: 'company'
                    },
                },
                result: {
                    data: {
                        getProjects: { items: [{ id: "project", project_name: "myproject" }] },
                    },
                },
            }
        ];
        render(
            <MockedProvider mocks={mocks}>
                <ApiKey company="mycompany" getUser={getUser} />
            </MockedProvider>
        )


    })
})