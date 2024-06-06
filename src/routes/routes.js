import express from 'express';
const routes = express.Router();
import paginaInicial from '../controllers/paginaIncial.js'


/**
 * @swagger
 * /:
 *   get:
 *     summary: Rota Raíz do Site
 *     description: Sucesso.
*/


routes.get("/", paginaInicial.render );






export default routes;