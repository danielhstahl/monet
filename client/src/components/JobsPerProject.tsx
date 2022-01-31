import { Table } from 'antd'
import {
    useQuery
} from "@apollo/client";
import { getJobsByProject } from '../graphql/queries';
type Person = {
    name: string;
    age: number;
}
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
const JobsTable = ({ }) => {
    //console.log("got here")
    const { loading, error, data } = useQuery(getJobsByProject);
    //const [data, setData] = useState([])
    //useEffect(() => {

    //})

    return <Table loading={loading} dataSource={data} columns={columns} />
}
export default JobsTable