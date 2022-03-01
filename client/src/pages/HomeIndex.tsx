import { Link } from "react-router-dom"
import { METRICS, API_KEY, API_DOCS } from "../constants/routes"

const HomeIndex = () => <p>
    Welcome to the job coordinator!  This application tracks your jobs and aggregates job metrics in one place regardless of the underlying orchestrator.
    Get started by creating or selecting a project in <Link to={METRICS}>Metrics</Link>.
    Then head over to <Link to={API_KEY}>Api Key</Link> to create an api key and review instructions on how to use the REST API.
    Or simply take a look at the <Link to={API_DOCS}>Swagger Docs</Link> to learn how to interact with the Rest API.
</p>

export default HomeIndex