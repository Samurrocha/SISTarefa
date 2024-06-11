import { PrismaClient } from "@prisma/client";
import { parse } from "dotenv";
const Prisma = new PrismaClient


class Usuarios_TarefasController {


    async create(req, res) {

        const { funcaoUsuario } = req.body;
        const idUsuario = parseInt(req.body.idUsuario)
        const idTarefa = parseInt(req.body.idTarefa)

        const properties = ["funcaoUsuario", "idUsuario", "idTarefa"]

        for (const prop of properties) {
            if (!(prop in req.body)) {
                return res.status(400).send(`É necessária a propriedade '${prop}'`);
            }
        }

        if (funcaoUsuario != "participante" && funcaoUsuario != "responsavel") {
            return res.status(400).send(`Não existem funções do usuario além de 'participante' e 'reponsavel'`)
        }

        const usuario = await Prisma.tbl_usuarios.findUnique({
            where: {
                Id: idUsuario
            }
        })

        if (!usuario) {
            return res.status(400).send("nao existe este usuario")
        }

        const tarefa = await Prisma.tbl_tarefas.findUnique({
            where: {
                Id: idTarefa
            }
        })

        if (!tarefa) {
            return res.status(400).send("nao existe esta tarefa cadastrada")
        }

        const funcao = await Prisma.tbl_usuariosTarefas.findMany({
            where: {
                Id_Usuario: idUsuario,
                Id_Tarefa: idTarefa
            }
        })


        if (funcao.length >= 1) {
            return res.status(400).send(`Este usuario ja tem uma função neste tarefa`)
        }


        try {
            const newUserTask = await Prisma.tbl_usuariosTarefas.create({
                data: {
                    Usuario: {
                        connect: { Id: idUsuario }
                    },

                    Tarefa: {
                        connect: { Id: idTarefa }
                    },

                    Funcao: funcaoUsuario

                }
            })
            res.send(newUserTask)
        } catch (error) { }
    }


    async read(req, res) {

        try {
            const allUsersTasks = await Prisma.tbl_usuariosTarefas.findMany();

            res.send(allUsersTasks);
        } catch (error) { }
    };


    async update(req, res) {

        const { coluna, valor } = req.body;
        const idUsuario = parseInt(req.body.idUsuario)
        const idTarefa =parseInt(req.body.idTarefa)

        const properties = ["idUsuario","idTarefa", "coluna", "valor"]

        for (const prop of properties) {
            if (!(prop in req.body)) {
                return res.status(400).send(`É necessária a propriedade '${prop}'`);
            }
        }

        const UserTaskColuna = ["Funcao", "Id_Usuario", "Id_Tarefa"]

        if (!UserTaskColuna.includes(coluna)) {
            return res.status(400).send(`nao existe a coluna ${coluna}`)
        }

        if (isNaN(idUsuario)  || isNaN(idTarefa)) {
            return res.status(400).send(`'idUsuario' ou 'idTarefa' devem ser numeros`)
        }

        if (coluna == "Funcao") {
            if (valor != "participante" && valor != "responsavel") {
                return res.status(400).send(`Não existem funções do usuario além de 'participante' e 'reponsavel'`)

            }
        }


        const userTarefa = await Prisma.tbl_usuariosTarefas.findMany({
            where:{
                Id_Usuario: idUsuario,
                Id_Tarefa:idTarefa
            }
        })
    
        if (userTarefa.length == 0) {
            return res.status(400).send(`usuario com função nesta tarefa nao encontrado`)
        }

        try {
            const updateUsersTasks = await Prisma.tbl_usuariosTarefas.updateMany({
                where: {
                    Id_Usuario: idUsuario,
                    Id_Tarefa: idTarefa
                },
                data: {
                    [coluna]: valor
                }
            })

            res.send(updateUsersTasks)
        } catch (error) { res.status(500).send(`Erro do servidor ao atualizar usuario_tarefa: ${error.message}`) };
    }



    async delete(req,res) {
        const idUsuario = parseInt(req.body.idUsuario);
        const idTarefa = parseInt(req.body.idTarefa);

        if (!("idUsuario" in req.body && "idTarefa" in req.body)) {
            res.send("São necessárias as propriedades 'idUsuario' e 'idTarefa'")
        }

        if (isNaN(idUsuario)  || isNaN(idTarefa)) {
            return res.status(400).send(`'idUsuario' ou 'idTarefa' devem ser numeros`)
        }

        const findTarefa = await Prisma.tbl_usuariosTarefas.findMany({
            where:{
                Id_Tarefa : idTarefa,
                Id_Usuario: idUsuario
            }
        })

        if (findTarefa.length == 0) {
            return res.status(400).send(`este usuario nao esta relacionado a esta tarefa`)
        }

        try {
            const delUsersTasks = await Prisma.tbl_usuariosTarefas.deleteMany({
                where: {
                    Id_Usuario: idUsuario,
                    Id_Tarefa:idTarefa
                }
            })

            res.send(`usuario desrelacionado a esta tarefa com sucessso`)
        } catch (error) { res.status(500).send(`Erro do servidor ao deletar a tarefa_usuario: ${error.message}`) };

    }


}

export default new Usuarios_TarefasController();





