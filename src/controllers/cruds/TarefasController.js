import { PrismaClient } from "@prisma/client";
import moment from "moment";
const Prisma = new PrismaClient()


class TarefasController {


    async create(req, res) {

        if (req.nivel_de_acesso != "gerente" && req.nivel_de_acesso != "administrador") {
            return res.status(403).json({ mensagem: 'Acesso negado. Esta operação requer privilégios de administrador.' });
        }



        const { dataInicio, dataTermino, descricao } = req.body;
        const idProjeto = parseInt(req.body.idProjeto)

        const properties = ["dataInicio", "dataTermino", "idProjeto", "descricao"]

        for (const prop of properties) {
            if (!(prop in req.body)) {
                return res.status(400).send(`É necessária a propriedade '${prop}'`);
            }
        };


        const projetos = await Prisma.tbl_projetos.findUnique({
            where: {
                Id: idProjeto
            }
        })

        if (!projetos) {
            return res.status(400).send(`Não existe esse projeto cadastrado`)
        };


        // Verificar se a data é válida
        function isValidISO8601(dateString) {
            return moment(dateString, moment.ISO_8601, true).isValid();
        }

        if (!isValidISO8601(dataInicio) || !isValidISO8601(dataTermino)) {
            return res.status(400).send(`'dataInicio' e/ou 'dataTermino' nao estao no formato 'ISO8601'`)
        }

        const inicio = new Date(dataInicio).toISOString()
        const termino = new Date(dataTermino).toISOString()

        try {
            const newTask = await Prisma.tbl_tarefas.create({
                data: {

                    Data_Inicio: inicio,
                    Data_Termino: termino,
                    Projeto_Associada: {
                        connect: { Id: idProjeto }
                    },
                    Descricao_Tarefa: descricao,


                }
            })

            return res.send(newTask)

        } catch (error) { `Erro do servidor ao criar tarefa, ERRO : \n ${error}` }
    }


    async read(req, res) {

console.log(req.usuario_de_acesso)

        if (req.nivel_de_acesso == "comum") {
            console.log(req.userId)
            const tarefas = await Prisma.tbl_usuariosTarefas.findMany({
                where: {
                    Id_Usuario: req.userId
                }
            })

            if (tarefas.length < 1) {
                return res.send(`não há tarefas para este usuario`)
            }

            const tarefasId = []
            tarefas.forEach(element => {
                tarefasId.push(element.Id_Tarefa)
            });

            try {
                const userTarefas = await Prisma.tbl_tarefas.findMany({
                    where: {
                        Id: {
                            in: tarefasId
                        }
                    }
                });

                return res.status(200).send(userTarefas)

            } catch (error) { `erro do servidor ao buscar tarefas` }

        }


        try {
            const allTasks = await Prisma.tbl_tarefas.findMany();

            res.send(allTasks);
        } catch (error) { `erro do servidor ao buscar tarefas` }
    };


    async update(req, res) {

        if (req.nivel_de_acesso != "gerente" && req.nivel_de_acesso != "administrador") {
            return res.status(403).json({ mensagem: 'Acesso negado. Esta operação requer privilégios de administrador.' });
        }




        const id = parseInt(req.body.id)
        let { coluna, valor } = req.body;
        const properties = ["coluna", "valor", "id"]

        for (const prop of properties) {
            if (!(prop in req.body)) {
                return res.status(400).send(`É necessária a propriedade '${prop}'`);
            }
        }

        const tarefa = await Prisma.tbl_tarefas.findUnique({
            where: {
                Id: id
            }
        })

        if (!tarefa) {
            return res.status(400).send(`não existe tarefa com este 'Id'`)
        }

        const colunasTarefas = ["Data_Inicio", "Data_Termino", "Id_Projeto", "Descricao_Tarefa", "Concluida"]

        if (!colunasTarefas.includes(coluna)) {

            return res.status(400).send("nao existe essa coluna")

        }

        if (coluna == "Data_Inicio" || coluna == "Data_Termino") {

            // Verificar se a data é válida
            function isValidISO8601(dateString) {
                return moment(dateString, moment.ISO_8601, true).isValid();
            }

            if (!isValidISO8601(valor)) {
                return res.status(400).send(`'Data_Inicio' nao está no formato 'ISO8601'`)
            }

            valor = new Date(valor).toISOString()
        }

        try {
            const updateTask = await Prisma.tbl_tarefas.update({

                where: {
                    Id: id

                },
                data: {

                    [coluna]: valor
                }
            })

            res.send(updateTask)
        } catch (error) { `erro ao tentar atualiza o ${coluna} para ${valor}` }
    }



    async delete(req, res) {

        if (req.nivel_de_acesso != "gerente" && req.nivel_de_acesso != "administrador") {
            return res.status(403).json({ mensagem: 'Acesso negado. Esta operação requer privilégios de administrador.' });
        }




        const id = parseInt(req.body.id);

        const tarefa = await Prisma.tbl_tarefas.findUnique({
            where: {
                Id: id
            }
        })

        if (!tarefa) {
            return res.status(400).send(`não existe tarefa com este 'Id'`)
        }

        try {
            const delTask = await Prisma.tbl_tarefas.delete({
                where: {
                    Id: id
                }
            })

            res.send(delTask)
        } catch (error) { `erro  do servidor a tentar  deletar tarefa de id = ${id}` }
    }


    async relatorio(req, res) {

        const usuario = req.query.Usuario
        const usuarioDeAcesso = req.query.UsuarioDeAcesso
        const usuarioEmail = req.query.UsuarioEmail
        let idProjeto = req.query.IdProjeto
        let concluida = req.query.Concluida
        let dataCriacaoInicio = req.query.DataCriacaoInicio
        let dataCriacaoFim = req.query.DataCriacaoFim

        if (idProjeto) {
            idProjeto = parseInt(idProjeto)
        }

        if (concluida === "true") {
            concluida = Boolean("true")
        } else if (concluida === "false") { concluida = Boolean("") }


        function isValidISO8601(dateString) {
            return moment(dateString, moment.ISO_8601, true).isValid();
        }

        if (dataCriacaoInicio) {
            if (!isValidISO8601(dataCriacaoInicio)) {
                return res.status(400).send(`data de modificacao Inicial no formato incorreto`);
            }

            dataCriacaoInicio = new Date(dataCriacaoInicio)
        }


        if (dataCriacaoFim) {
            if (!isValidISO8601(dataCriacaoFim)) {
                return res.status(400).send(`data de modificacao final no formato incorreto`);
            }

            dataCriacaoFim = new Date(dataCriacaoFim)
        }


        if (usuario || usuarioDeAcesso || usuarioEmail) {

            const filtroUsuario = await Prisma.tbl_usuarios.findMany({
                where: {
                    AND: [

                        {
                            Nome: {
                                contains: usuario
                            }
                        },

                        {
                            Email: {
                                contains: usuarioEmail
                            }
                        },

                        {
                            Usuario_de_Acesso: {
                                contains: usuarioDeAcesso
                            }
                        }
                    ]
                }
            })


            var idUsuarios = []
            filtroUsuario.forEach(element => {
                idUsuarios.push(element.Id)
            });


            const filtroUserTask = await Prisma.tbl_usuariosTarefas.findMany({
                where: {
                    Id_Usuario: { in: idUsuarios }
                }
            })

            var idTarefas = []

            filtroUserTask.forEach(element => {
                idTarefas.push(element.Id_Tarefa)
            });

        }


        const filtro = await Prisma.tbl_tarefas.findMany({
            where: {
                AND: [

                    {
                        Id: {
                            in: idTarefas,             // Exemplo de lista de IDs de tarefas
                        }
                    },

                    { Id_Projeto: idProjeto },

                    {
                        Data_Criacao: {
                            gt: dataCriacaoInicio,
                            lt: dataCriacaoFim
                        }
                    },

                    { Concluida: concluida }

                ]
            }
        })


        if (filtro.length == 0) {
            return res.status(400).send("não foram encontradas tarefas com estes filtros")
        }




        res.render('relatorioTarefa', { filtroTarefa: filtro })


    }


}




export default new TarefasController();

