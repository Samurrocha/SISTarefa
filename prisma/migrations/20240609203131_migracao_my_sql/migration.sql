-- CreateTable
CREATE TABLE `tbl_usuarios` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nome` VARCHAR(191) NOT NULL,
    `Senha` VARCHAR(191) NOT NULL,
    `Usuario_de_Acesso` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Data_Criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Nivel_Acesso` ENUM('comum', 'administrador', 'gerente') NOT NULL,
    `Data_Modificacao` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbl_usuarios_Senha_key`(`Senha`),
    UNIQUE INDEX `tbl_usuarios_Usuario_de_Acesso_key`(`Usuario_de_Acesso`),
    UNIQUE INDEX `tbl_usuarios_Email_key`(`Email`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_projetos` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nome` VARCHAR(191) NOT NULL,
    `Data_Inicio` DATETIME(3) NOT NULL,
    `Id_Gerente` INTEGER NOT NULL,

    UNIQUE INDEX `tbl_projetos_Nome_key`(`Nome`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_tarefas` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Data_Criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Data_Modificacao` DATETIME(3) NOT NULL,
    `Data_Inicio` DATETIME(3) NOT NULL,
    `Data_Termino` DATETIME(3) NOT NULL,
    `Id_Projeto` INTEGER NOT NULL,
    `Descricao_Tarefa` VARCHAR(191) NOT NULL,
    `Concluida` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_usuariosTarefas` (
    `Id_Usuario` INTEGER NOT NULL,
    `Id_Tarefa` INTEGER NOT NULL,
    `Funcao` ENUM('responsavel', 'participante') NOT NULL,

    PRIMARY KEY (`Id_Usuario`, `Id_Tarefa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_projetos` ADD CONSTRAINT `tbl_projetos_Id_Gerente_fkey` FOREIGN KEY (`Id_Gerente`) REFERENCES `tbl_usuarios`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_tarefas` ADD CONSTRAINT `tbl_tarefas_Id_Projeto_fkey` FOREIGN KEY (`Id_Projeto`) REFERENCES `tbl_projetos`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_usuariosTarefas` ADD CONSTRAINT `tbl_usuariosTarefas_Id_Usuario_fkey` FOREIGN KEY (`Id_Usuario`) REFERENCES `tbl_usuarios`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_usuariosTarefas` ADD CONSTRAINT `tbl_usuariosTarefas_Id_Tarefa_fkey` FOREIGN KEY (`Id_Tarefa`) REFERENCES `tbl_tarefas`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
