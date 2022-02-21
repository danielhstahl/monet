
import { Form, Button, Input } from 'antd';
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

    return <div>
    <Form
        layout="vertical"
        name="basic"
        autoComplete="off"
    >
        <Form.Item
            label="Project Name"
            name="Project-Name"
            rules={[{ required: true, message: 'Please input your username!' }]}
        >
            <Input 
                placeholder='Project name'
                onPressEnter={submit}
                value={projectName}
                onChange={e => setProjectName(e.target.value)} 
            />
        </Form.Item>

        <Form.Item name="submit">
            <Button 
                onClick={submit} 
                loading={loading}
                type="primary"
            > Create Project 
            </Button>
      </Form.Item>

    </Form>
</div>
}

export default CreateProject