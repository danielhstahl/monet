import { useState } from "react"
import JobsPerProject from "../components/JobsPerProject"
import SelectProject from "../components/SelectProject"
import { CREATE_PROJECT } from '../graphql/mutations';
import { useMutation } from "@apollo/client";
import CreateProject from "../components/CreateProject";
type Props = {
    company: string
}
const Metrics = ({ company }: Props) => {
    const [projectId, setProjectId] = useState<string | null>(null)
    const [createProject, { loading }] = useMutation(CREATE_PROJECT)
    return <>
        <CreateProject company={company} createProject={createProject} loading={loading} />
        <SelectProject company={company} setProject={setProjectId} />
        {projectId && <JobsPerProject company={company} project_id={projectId} />}
    </>

}

export default Metrics