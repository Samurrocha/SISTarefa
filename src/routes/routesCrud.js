import express from 'express';
const routes = express.Router();
import paginaInicial from '../controllers/paginaIncial.js'
import UsuariosController from '../controllers/cruds/usuariosController.js';
import ProjetosController from '../controllers/cruds/ProjetosController.js';
import TarefasController from '../controllers/cruds/TarefasController.js';
import User_TarefasController from '../controllers/cruds/User_TarefasController.js';
import authController from '../middlewares/authController.js';
import usuariosController from '../controllers/cruds/usuariosController.js';

/**
 * @swagger
 * /:
 *   get:
 *     summary: Rota Raíz do Site
 *     description: Sucesso.
*/


routes.get("/", paginaInicial.render);



/**
 * @swagger
 * /:
 *   get:
 *     summary: CRUD Usuarios
 *     description: Sucesso.
*/

routes.post("/api/usuario", usuariosController.create);
routes.get("/usuario", UsuariosController.read);
routes.put("/api/usuario", UsuariosController.update);
routes.delete("/api/usuario", UsuariosController.delete);
routes.get("/api/usuario/relatorio", UsuariosController.relatorio)



/**
 * @swagger
 * /:
 *   get:
 *     summary: CRUD Projetos
 *     description: Sucesso.
*/


routes.post("/api/projeto", authController, ProjetosController.create);
routes.get("/api/projeto", authController, ProjetosController.read);
routes.put("/api/projeto", authController, ProjetosController.update);
routes.delete("/api/projeto",authController, ProjetosController.delete);



/**
 * @swagger
 * /:
 *   get:
 *     summary: CRUD Tarefas
 *     description: Sucesso.
*/


routes.post("/api/tarefa", authController, TarefasController.create);
routes.get("/api/tarefa", authController, TarefasController.read);
routes.put("/api/tarefa", authController, TarefasController.update);
routes.delete("/api/tarefa", authController, TarefasController.delete);
routes.get("/api/tarefa/relatorio", authController,TarefasController.relatorio);






/**
 * @swagger
 * /:
 *   get:
 *     summary: CRUD Usuarios_Tarefas
 *     description: Sucesso.
*/


routes.post("/api/userTask",authController, User_TarefasController.create);
routes.get("/api/userTask",authController, User_TarefasController.read);
routes.put("/api/userTask",authController, User_TarefasController.update);
routes.delete("/api/userTask",authController, User_TarefasController.delete);


export default routes;