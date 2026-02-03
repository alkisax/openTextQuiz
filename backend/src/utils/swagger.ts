// backend\src\utils\swagger.ts
// import m2s from 'mongoose-to-swagger';
import swaggerJsdoc from 'swagger-jsdoc';
// import yaml from 'yamljs';
// import path from 'path';

// const userRoutesDocs = yaml.load(
//   path.join(__dirname, 'swaggerRoutes', 'userRoutes.swagger.yml')
// );


const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      version: '1.0.0',
      title: 'User and Auth API',
      description: 'An application for managing users and authentication (JWT and Google login)',
    },
    components: {
      schemas: {
        // User: m2s(User),
      },
      // securitySchemes: {
      //   bearerAuth: {
      //     type: 'http',
      //     scheme: 'bearer',
      //     bearerFormat: 'JWT'
      //   }
      // }
    },
    // security: [{ bearerAuth: [] }],
    paths: {
      // ...pdfRoutesDocs.paths, // merge
    },
  },
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
