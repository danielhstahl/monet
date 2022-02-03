import { useEffect, useState } from "react"
import SelectProject from "./SelectProject"
import { CREATE_API_KEY } from "../graphql/mutations"
import { Button, Modal, Spin } from "antd"
import { useMutation } from "@apollo/client";

type Props = {
    company: string,
    getUser: () => Promise<string | undefined>
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
    getUser: () => Promise<string | undefined>,
    data: Data
}
const ApiDisplay = ({ project_id, loading, data, createApiKey, getUser }: DisplayProps) => {
    useEffect(() => {
        project_id && getUser().then(user_id => {
            createApiKey({ variables: { user_id, project_id } })
        })
    }, [project_id, getUser, createApiKey])
    return loading ? <Spin /> : <h3>{data?.addApiKey?.api_key}</h3>
}

const ApiKey = ({ company, getUser }: Props) => {
    const [projectId, setProjectId] = useState<string | null>(null)
    const [visible, setVisible] = useState(false)
    const [createApiKey, { loading, data }] = useMutation(CREATE_API_KEY)
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
                getUser={getUser}
            />
        </Modal>
    </>
}

export default ApiKey