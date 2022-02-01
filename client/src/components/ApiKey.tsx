import { useEffect, useState } from "react"
import SelectProject from "./SelectProject"
import { CREATE_API_KEY } from "../graphql/mutations"
import { Button, Modal, Spin } from "antd"
import { useMutation } from "@apollo/client";
import { useOktaAuth } from '@okta/okta-react';

type Props = {
    company: string
}
type ApiKeyType = {
    api_key: string
}
type Data = {
    addApiKey: ApiKeyType
}
type ApiProps = {
    user_id: string | undefined
    project_id: string
}
type Variables = {
    variables: ApiProps
}
type DisplayProps = {
    project_id: string | null,
    loading: boolean,
    createApiKey: (arg0: Variables) => void,
    data: Data
}
const ApiDisplay = ({ project_id, createApiKey, loading, data }: DisplayProps) => {
    const { oktaAuth } = useOktaAuth()
    useEffect(() => {
        project_id && oktaAuth.getUser().then(user => {
            const { preferred_username, email } = user
            console.log(user)
            createApiKey({ variables: { user_id: preferred_username || email, project_id } })
        })
    }, [project_id, oktaAuth, createApiKey])
    return loading ? <Spin /> : <h3>{data?.addApiKey?.api_key}</h3>
}
const ApiKey = ({ company }: Props) => {
    const [projectId, setProjectId] = useState<string | null>(null)
    const [visible, setVisible] = useState(false)
    const [createApiKey, { loading, error, data }] = useMutation(CREATE_API_KEY)
    const close = () => setVisible(false)
    return <>
        <SelectProject setProject={setProjectId} company={company} />
        {projectId && <Button type="primary" onClick={() => setVisible(true)}>
            Generate new API key and overwrite previous.
        </Button>}
        <Modal
            title="Copy the API key, this is the last time you will see it"
            visible={visible}
            onOk={close}
            onCancel={close}
        >
            <ApiDisplay
                createApiKey={createApiKey}
                project_id={projectId}
                loading={loading}
                data={data}
            />
        </Modal>
    </>
}

export default ApiKey