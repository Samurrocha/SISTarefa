import express from 'express';
const routes = express.Router();
import paginaInicial from '../controllers/paginaIncial.js'
import usuariosController from '../controllers/cruds/usuariosController.js';
import ProjetosController from '../controllers/cruds/ProjetosController.js';
import TarefasController from '../controllers/cruds/TarefasController.js';
import Usuarios_TarefasController from '../controllers/cruds/Usuarios_TarefasController.js';

/**
 * @swagger
 * /:
 *   get:
 *     summary: Rota Raíz do Site
 *     description: Sucesso.
*/


routes.get("/", paginaInicial.render );



/**
 * @swagger
 * /:
 *   get:
 *     summary: CRUD Usuarios
 *     description: Sucesso.
*/

routes.post("/usuario", usuariosController.create);
routes.get("/usuario",  usuariosController.read);
routes.put("/usuario",  usuariosController.update);
routes.delete("/usuario",  usuariosController.delete);



/**
 * @swagger
 * /:
 *   get:
 *     summary: CRUD Projetos
 *     description: Sucesso.
*/


routes.post("/projeto", ProjetosController.create);
routes.get("/projeto",  ProjetosController.read);
routes.put("/projeto",  ProjetosController.update);
routes.delete("/projeto",  ProjetosController.delete);



/**
 * @swagger
 * /:
 *   get:
 *     summary: CRUD Tarefas
 *     description: Sucesso.
*/


routes.post("/tarefa", TarefasController.create);
routes.get("/tarefa",  TarefasController.read);
routes.put("/tarefa",  TarefasController.update);
routes.delete("/tarefa",  TarefasController.delete);






/**
 * @swagger
 * /:
 *   get:
 *     summary: CRUD Usuarios_Tarefas
 *     description: Sucesso.
*/


routes.post("/userTask", Usuarios_TarefasController.create);
routes.get("/userTask",  Usuarios_TarefasController.read);
routes.put("/userTask",  Usuarios_TarefasController.update);
routes.delete("/userTask",  Usuarios_TarefasController.delete);


export default routes;