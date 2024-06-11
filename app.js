import express from 'express';
import routes from  './src/routes/routes.js'

class App {
    constructor() {
        this.app = express()
        this.middleware()
        this.routes()
    }
     middleware() {
         this.app.use(express.urlencoded({ extended: true }))
         this.app.use(express.json())
    }
    routes() {
        this.app.use('/', routes)
       /this.app.use('/usuario/', routes)
        //this.app.use('/tokens/', tokenRoutes)
    }
}

export default new App().app

