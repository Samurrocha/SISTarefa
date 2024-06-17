import { Router } from 'express'
import tokenController from '../controllers/tokenController.js'

const router = new Router()

router.post("/login",tokenController.store)


export default router