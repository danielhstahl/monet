import { render, screen } from '@testing-library/react';
import ApiKey, { ApiDisplay } from './ApiKey';
import { MockedProvider } from '@apollo/client/testing';
import { CREATE_API_KEY } from "../graphql/mutations"
import { GET_PROJECTS } from '../graphql/queries';

describe('ApiDisplay', () => {
    test('shows api key if not loading', async () => {
        const data = {
            addApiKey: {
                api_key: "api key"
            }
        }
        render(<ApiDisplay
            loading={false}
            data={data}
        />
        )
        const apikey = await screen.findByText(/api key/i);
        expect(apikey).toBeInTheDocument();
    })
    test('spins when loading', () => {
        const data = {
            addApiKey: {
                api_key: "api key"
            }
        }
        const { container } = render(<ApiDisplay
            loading={true}
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
                <ApiKey restEndpoint='mytestendpoint' company="mycompany" getUser={getUser} />
            </MockedProvider>
        )
        const endpoint = screen.getByText("REST endpoint: mytestendpoint");
        expect(endpoint).toBeInTheDocument();


    })
})