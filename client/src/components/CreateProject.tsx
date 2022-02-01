
import { Button, Input } from 'antd';
import { useState } from 'react';

type ProjectProps = {
    project_name: string,
    company: string
}
type Variables = {
    variables: ProjectProps
}
type Props = {
    company: string,
    createProject: (arg0: Variables) => void,
    loading: boolean
}
const CreateProject = ({ company, createProject, loading }: Props) => {

    const [projectName, setProjectName] = useState("")
    const submit = () => createProject({ variables: { project_name: projectName, company } })

    return <Input.Group compact>
        <Input placeholder='Project name'
            onPressEnter={submit}
            value={projectName}
            onChange={e => setProjectName(e.target.value)} />
        <Button onClick={submit} loading={loading}>Create Project</Button>
    </Input.Group>


}

export default CreateProject