import { Select } from 'antd';
import { getProjects } from '../graphql/queries';
import { useQuery } from "@apollo/client";

const { Option } = Select;
type Props = {
    company: string,
    setProject: (project_id: string) => void
}
type Project = {
    id: string,
    project_name: string
}
const SelectProject = ({ company, setProject }: Props) => {
    const limit = 999 //appsync has a hard max at 999 I believe, it will be a while before we get to that point :)
    const { loading, error, data } = useQuery(getProjects, { variables: { company, limit } });
    console.log(data)
    return data ? <Select
        showSearch
        style={{ width: 200 }}
        loading={loading}
        onChange={setProject}
    >
        {data.items.map(({ id, project_name }: Project) => <Option key={id} value={id}>{project_name}</Option>)}
    </Select> : <p>Please create a project first</p>
}

export default SelectProject