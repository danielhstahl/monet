import { Link } from "react-router-dom"
import { METRICS, API_KEY } from "../constants/routes"

const HomeIndex = () => <p>
    Welcome to the job coordinator!  This application tracks your jobs and aggregates job metrics in one place regardless of the underlying orchestrator.
    <br />
    Get started by creating or selecting a project in <Link to={METRICS}>Metrics</Link>.  Then head over to <Link to={API_KEY}>Api Key</Link> to create an api key and view documentation on how to use the REST API.
</p>

export default HomeIndex