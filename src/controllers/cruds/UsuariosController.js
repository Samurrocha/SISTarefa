import { PrismaClient, nivel_de_acesso } from "@prisma/client";
import moment from "moment";
import bpcryptjs from "bcryptjs"
const Prisma = new PrismaClient()


class UsuariosController {


    async create(req, res) {



        const { Nome, Senha, Usuario_de_Acesso, Email, Nivel_Acesso } = req.body;
        const properties = ["Nome", "Senha", "Usuario_de_Acesso", "Email", "Nivel_Acesso"]
        const acessos = ["administrador", "gerente", "comum"]


        for (const prop of properties) {
            if (!(prop in req.body)) {
                return res.status(400).send(`É necessária a propriedade '${prop}'`);
            }
        }


        if (!acessos.includes(Nivel_Acesso.toLowerCase())) {
            return res.send("nivel de acesso inexistente")
        }

        const uniqEmail = await Prisma.tbl_usuarios.findUnique({
            where: {
                Email: Email
            }
        })

        if (uniqEmail) {
            res.status(400).send("esse email ja esta cadastrado")
        }

        const hashSenha = await bpcryptjs.hash(Senha, 10)

        try {
            const newUser = await Prisma.tbl_usuarios.create({
                data: {
                    Nome: Nome,
                    Senha: hashSenha,
                    Usuario_de_Acesso: Usuario_de_Acesso,
                    Email: Email,
                    Nivel_Acesso: Nivel_Acesso.toLowerCase()
                }
            })

            res.send(newUser)
        } catch (error) { `erro do servirdo ao tentar criar um novo usuario \n ERRO: ${error}` }

    }


    async read(req, res) {

        try {
            const allUsers = await Prisma.tbl_usuarios.findMany();
            res.send(allUsers);
        } catch (error) { res.status(500).send(`Erro do servidor ao tentar ler todos os usuários \n ERRO: ${error}`) }

    };


    async update(req, res) {

        if (Prisma.tbl_usuarios) {

        }

        const id = parseInt(req.body.id)
        const { coluna, valor } = req.body

        const properties = ["coluna", "valor"]

        for (const prop of properties) {
            if (!(prop in req.body)) {
                return res.status(400).send(`É necessária a propriedade '${prop}'`);
            }
        }

        const colunasUsuarios = ["Id", "Nome", "Senha", "Usuario_de_Acesso", 'Email', "Nivel_Acesso"]

        if (!colunasUsuarios.includes(coluna)) {

            return res.status(400).send("nao existe essa coluna")
        }

        const userId = await Prisma.tbl_usuarios.findUnique({
            where: {
                Id: id
            }
        })

        if (!userId) {
            return res.status(400).send("Não existe ste usuario")
        }

        try {
            const updateUser = await Prisma.tbl_usuarios.update({

                where: {
                    Id: id

                },
                data: {

                    [coluna]: valor
                }
            })
            res.send(updateUser)

        } catch (error) { res.status(500).send(`Erro do servidor ao atualizar o usuário: ${error.message}`) }

    }



    async delete(req, res) {
        const id = parseInt(req.body.id);

        if (isNaN(id)) {
            return res.status(400).send("É necessário um 'id' para deletar o usuário ");
        };

        //verificação se existe este usuario
        const user = await Prisma.tbl_usuarios.findUnique({
            where: {
                Id: id
            }
        })


        if (!user) {
            return res.status(400).send("Este usuario não existe");
        }


        await Prisma.tbl_usuariosTarefas.deleteMany({
            where: {
                Id_Usuario: id
            }
        })


        const projetoTarefa = await Prisma.tbl_projetos.findMany({
            where: {
                Id_Gerente: id
            }
        })


        if (projetoTarefa.length >= 1) {

            for (const projeto of projetoTarefa) {

                const tarefas = await Prisma.tbl_tarefas.findMany({
                    where: {
                        Id_Projeto: projeto.Id
                    }
                })

                for (const tarefa of tarefas) {
                    await Prisma.tbl_usuariosTarefas.deleteMany({
                        where: {
                            Id_Tarefa: tarefa.Id
                        }
                    })
                }


                await Prisma.tbl_tarefas.deleteMany({
                    where: {
                        Id_Projeto: projeto.Id
                    }
                })

                await Prisma.tbl_projetos.deleteMany({
                    where: {
                        Id: projeto.Id
                    }
                })
            }
        }


        try {

            const delUser = await Prisma.tbl_usuarios.delete({
                where: {
                    Id: id
                }
            })

            res.send(`O seguinte usuário foi deletado:\n ${JSON.stringify(delUser)}`)

        } catch (error) { res.status(500).send(`Erro do servidor ao deletar usuário: ${error.message}`) };

    }


    async relatorio(req, res) {

        const nome = req.query.Nome
        const email = req.query.Email
        const nomeUsuario = req.query.NomeUsuario
        let dataCriacaoInicio = req.query.DataCriacaoInicio
        let dataCriacaoFim = req.query.DataCriacaoFim
        let dataModificacaoInicio = req.query.DataModificacaoInicio
        let dataModificacaoFim = req.query.DataModificacaoFim

        function isValidISO8601(dateString) {
            return moment(dateString, moment.ISO_8601, true).isValid();
        }


        if (dataCriacaoInicio) {
            if (!isValidISO8601(dataCriacaoInicio)) {
                return res.status(400).send(`data de inicio no formato incorreto`);
            }

            dataCriacaoInicio = new Date(dataCriacaoInicio)
        }

        if (dataCriacaoFim) {
            if (!isValidISO8601(dataCriacaoFim)) {
                return res.status(400).send(`data de Fim no formato incorreto`);
            }
            dataCriacaoFim = new Date(dataCriacaoFim)
        }


        if (dataModificacaoInicio) {
            if (!isValidISO8601(dataModificacaoInicio)) {
                return res.status(400).send(`data de modificacao Inicial no formato incorreto`);
            }

            dataModificacaoInicio = new Date(dataModificacaoInicio)
        }


        if (dataModificacaoFim) {
            if (!isValidISO8601(dataModificacaoFim)) {
                return res.status(400).send(`data de modificacao final no formato incorreto`);
            }

            dataModificacaoFim = new Date(dataModificacaoFim)
        }




        const filtro = await Prisma.tbl_usuarios.findMany({
            where: {
                AND: [

                    {
                        Nome: {
                            contains: nome,
                        }
                    },
                    { Email: { contains: email } },
                    { Usuario_de_Acesso: { contains: nomeUsuario } },
                    {
                        Data_Criacao: {
                            gt: dataCriacaoInicio,// Start date (inclusive)
                            lt: dataCriacaoFim// End date (inclusive)
                        }
                    },

                    {
                        Data_Modificacao: {
                            gt: dataModificacaoInicio,
                            lt: dataModificacaoFim
                        }
                    }

                ]
            }
        })

        if (filtro.length == 0) {
            return res.status(400).send("não foram encontrados usuarios com estes filtros")
        }


        res.render('relatorioUsuario', { filtroUsuario: filtro })


    }



}






export default new UsuariosController();




