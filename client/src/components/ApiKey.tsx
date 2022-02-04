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

type DisplayProps = {
    loading: boolean,
    data: Data
}
export const ApiDisplay = ({ loading, data }: DisplayProps) => {
    return loading ? <Spin /> : <h3>{data?.addApiKey?.api_key}</h3>
}

const ApiKey = ({ company, getUser }: Props) => {
    const [projectId, setProjectId] = useState<string | null>(null)
    const [visible, setVisible] = useState(false)
    const [createApiKey, { loading, data }] = useMutation(CREATE_API_KEY)
    const close = () => setVisible(false)
    const onClick = () => {
        setVisible(true)
        getUser().then(user_id => {
            createApiKey({ variables: { user_id, project_id: projectId } })
        })
    }
    return <>
        <SelectProject setProject={setProjectId} company={company} />
        {projectId && <Button type="primary" onClick={onClick}>
            Generate new API key and overwrite previous.
        </Button>}
        <Modal
            title="Copy the API key, this is the last time you will see it"
            visible={visible}
            onOk={close}
            onCancel={close}
        >
            <ApiDisplay
                loading={loading}
                data={data}
            />
        </Modal>
    </>
}

export default ApiKey