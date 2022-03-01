import { useState } from "react"
import JobsPerProject from "../components/JobsPerProject"
import SelectProject from "../components/SelectProject"
import { CREATE_PROJECT } from '../graphql/mutations';
import { useMutation } from "@apollo/client";
import CreateProject from "../components/CreateProject";

type Props = {
    company: string,
    projectId: string | null,
    setProjectId: (projectId: string | null) => void
}
const Metrics = ({ company, projectId, setProjectId }: Props) => {
    const [createProject, { loading }] = useMutation(CREATE_PROJECT)
    return <>
        <CreateProject company={company} createProject={createProject} loading={loading} />

        <hr />

        <SelectProject
            projectId={projectId}
            company={company}
            setProject={setProjectId}
        />

        {projectId && <JobsPerProject company={company} project_id={projectId} />}
    </>

}

export default Metrics