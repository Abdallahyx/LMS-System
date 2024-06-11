const express = require('express');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = 3000;
const routes = require('./routes');  // Import main router

mongoose.connect('mongodb://localhost:27017/lms-system', {});

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'LMS System API',
            description: 'LMS System API Information',
            contact: {
                name: 'Amazing Developer',
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Development server',
                },
            ],
        },
    },
    
    apis: [__filename, `${__dirname}/routes/*.js`], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware setup
app.use(express.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', routes);  // Mount main router

// Basic route
/**
 * @swagger
 * /:
 *  get:
 *    description: Use to test if server is running
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get('/', (req, res) => {
  res.send('Server is running');
});



  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });