import express from 'express';
import routes from './src/routes/routesCrud.js'
import routeToken from './src/routes/routeToken.js';
import authController from './src/middlewares/authController.js';

class App {
    constructor() {
        this.app = express()
        this.middleware()
        this.routes()
    }
    middleware() {
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json())
        this.app.use("/api", authController)
    }
    routes() {
        this.app.use(routes)
        this.app.use(routeToken)
    }
}

export default new App().app

