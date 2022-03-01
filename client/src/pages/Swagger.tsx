import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import swaggerDef from "../swagger.yaml"
const Swagger = ({ restEndpoint }: { restEndpoint: string }) => {
    swaggerDef.host = restEndpoint
    return <SwaggerUI spec={swaggerDef} />
}
export default Swagger