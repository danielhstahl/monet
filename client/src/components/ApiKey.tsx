import { useState } from "react"
import SelectProject from "./SelectProject"
import { CREATE_API_KEY } from "../graphql/mutations"
import { Button, Modal, Spin } from "antd"
import { useMutation } from "@apollo/client";

type Props = {
    company: string,
    restEndpoint: string,
    getUser: () => Promise<string | undefined>,
    projectId: string | null,
    setProjectId: (projectId: string | null) => void
}
type ApiKeyType = {
    api_key: string
}
type Data = {
    addApiKey: ApiKeyType
}

type DisplayProps = {
    loading: boolean,
    data: Data,
    restEndpoint: string,
    projectId: string | null,
    company: string,

}
export const ApiDisplay = ({ loading, projectId, company, data, restEndpoint }: DisplayProps) => {
    return loading || !data ? <Spin /> : <>
        <h3>API Key: {data?.addApiKey?.api_key}</h3>
        <h3>
            Create a new job reference
        </h3>
        <code>
            export API_KEY={data?.addApiKey?.api_key}
        </code>
        <br />
        <code>
            export BASE_URL={restEndpoint}
        </code>
        <br />
        <code>
            export PROJECT_ID={projectId}
        </code>
        <br />
        <code>
            curl -X POST $BASE_URL/project/$PROJECT_ID/job/create -d {`'{"name": "myjobname", "company": "`}{company}{`"}'`} -H "Content-Type: application/json" -H "Authorization: $API_KEY"
        </code>
        <h3>
            Start a job run
        </h3>
        <p>Use the job id returned from the previous curl command to export the JOB_ID environmental variable</p>
        <code>
            curl -X POST  $BASE_URL/job/$JOB_ID/start  -H "Content-Type: application/json" -H "Authorization: $API_KEY"
        </code>
        <h3>
            Finish a job run
        </h3>
        <p>Use the job run id returned from the previous curl command to export the JOB_RUN_ID environmental variable</p>
        <code>
            curl -X POST  $BASE_URL/job/$JOB_ID/run/$JOB_RUN_ID/finish -d {`'{"job_status": "SUCCESS"}'`}  -H "Content-Type: application/json" -H "Authorization: $API_KEY"
        </code>
    </>
}

const ApiKey = ({ company, restEndpoint, getUser, projectId, setProjectId }: Props) => {
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
        <p>REST endpoint: {restEndpoint}</p>
        <SelectProject projectId={projectId} setProject={setProjectId} company={company} />
        {projectId && <Button type="primary" onClick={onClick}>
            Generate new API key and overwrite previous.
        </Button>}
        <Modal
            title="Copy the API key, this is the last time you will see it"
            visible={visible}
            onOk={close}
            onCancel={close}
            width="70%"
        >
            <ApiDisplay
                loading={loading}
                projectId={projectId}
                company={company}
                restEndpoint={restEndpoint}
                data={data}
            />
        </Modal>
    </>
}

export default ApiKey