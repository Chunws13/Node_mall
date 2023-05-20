const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Swagger 버전
        info: {
            title: 'Node Mall API 문서', // API 문서 제목
            version: '1.0.0', // API 버전
            description: 'API 문서를 위한 Swagger',
        },
        servers: [{
            url: '52.79.197.128', // 서버 URL
        }, ],
    },
    apis: ['./routes/*.js'], // API 경로 설정

};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;