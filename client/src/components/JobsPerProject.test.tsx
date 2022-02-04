import JobsPerProject from "./JobsPerProject";
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_JOBS_BY_PROJECT } from '../graphql/queries';

describe('JobsPerProject', () => {
    test('it contains no button', () => {
        render(<MockedProvider><JobsPerProject
            company="company"
            project_id="project"
        /></MockedProvider>
        )
        const button = screen.queryByText("Next");
        expect(button).not.toBeInTheDocument()
    })
    /*test('it contains a button', async () => {
        const mocks = [
            {
                request: {
                    query: GET_JOBS_BY_PROJECT,
                    variables: {
                        company: "mycompany",
                        project_id: "myproject",
                        limit: undefined,
                        nextToken: undefined
                    },
                },
                result: {
                    data: {
                        getJobsByProject: {
                            nextToken: "mytoken",
                            items: [{
                                id: "someid",
                                job_name: "somejobname",
                                project_id: "myproject",
                                company: "mycompany",
                                last_time_job_completed: "2020",
                                last_time_job_completed_successfully: "2020",
                                total_successes: 3,
                                total_failures: 3,
                                jobs_currently_running: 0,
                                average_job_length_in_seconds: 2,
                                total_jobs: 6,
                                created_date: "2019"
                            }]
                        },
                    },
                }

            }
        ];
        render(<MockedProvider mocks={mocks} addTypename={false}><JobsPerProject
            company="mycompany"
            project_id="myproject"
        /></MockedProvider>
        )
        const button = await screen.findByText("Next");
        expect(button).toBeInTheDocument()
    })*/

})