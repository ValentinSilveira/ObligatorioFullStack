import { Router } from "express"
import v1Routes from "./v1.routes.js"

const apiRoutes = Router()
apiRoutes.use("/v1", v1Routes)


export default apiRoutes