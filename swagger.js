import swaggerJsdoc from "swagger-jsdoc"

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Uma API para controle de tarefas',
        contact: {
          name: 'Samuel Rodrigues',
          email: 'Samuel.rrocha12@gmail.com',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
  
          url: 'http://servidor1.com.br/apis/v1: ', // Caminho para os arquivos que contêm as definições das APIs
          description: 'Servidor de Produção',
          url: 'http://servidor1.com.br/apis/v2: ', // Caminho para os arquivos que contêm as definições das APIs
          description: 'Servidor de Homologação',
          url: 'http://localhost: 4000', // Caminho para os arquivos que contêm as definições das APIs
          description: 'Servidor de Desenvolvimento',
        },
      ],
    },
    apis: ['src/routes/routesCrud.js'], // Caminho para os arquivos que contêm as definições das APIs
    
    
  };

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec