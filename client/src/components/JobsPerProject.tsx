import { Table, Button } from 'antd'
import { useState } from 'react'
import { useQuery } from "@apollo/client";
import { GET_JOBS_BY_PROJECT } from '../graphql/queries';

const columns = [
    {
        title: "Job Id",
        dataIndex: "id",
        key: "id" //what is this for?
    },
    {
        title: "Job Name",
        dataIndex: "job_name",
        key: "job_name"
    },
    {
        title: "Successes",
        dataIndex: "total_successes",
        key: "total_successes",
    },
    {
        title: "Failures",
        dataIndex: "total_failures",
        key: "total_failures",
    },
    {
        title: "Last time completed",
        dataIndex: "last_time_job_completed_successfully",
        key: "last_time_job_completed_successfully",
    },
    {
        title: "Last time ran",
        dataIndex: "last_time_job_completed",
        key: "last_time_job_clast_time_job_completedompleted_successfully",
    },
    {
        title: "Average run time",
        dataIndex: "average_job_length_in_seconds",
        key: "average_job_length_in_seconds"
    }
]
type ProjectProps = {
    company: string,
    project_id: string
}
type Props = {
    company: string,
    project_id: string,
    limit: number,
    nextToken: string | null,
    setNextToken: (nextToken: string) => void
}

const JobsTable = ({ company, project_id, limit, nextToken, setNextToken }: Props) => {
    const { loading, data } = useQuery(GET_JOBS_BY_PROJECT, { variables: { company, project_id, limit, nextToken } });
    const onChange = () => setNextToken(data?.getJobsByProject?.nextToken)
    console.log(data)
    return <><Table
        loading={loading}
        dataSource={data?.getJobsByProject?.items}
        columns={columns}
        pagination={false}
    />
        {data?.getJobsByProject?.nextToken && <Button onClick={onChange}>Next</Button>}</>
}


const JobsPerProject = ({ company, project_id }: ProjectProps) => {
    const [token, setToken] = useState<string | null>(null)
    return <JobsTable company={company} project_id={project_id} nextToken={token} setNextToken={setToken} limit={50} />
}
export default JobsPerProject