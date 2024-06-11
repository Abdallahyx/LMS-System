const express = require('express');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = 3000;
const routes = require('./routes');  // Import main router
const Course = require('./models/Course');  // Import Course model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lms-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          title: 'LMS System API',
          description: 'API Documentation for LMS System',
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
      components: {
          securitySchemes: {
              BearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
              },
          },
      },
      security: [
          {
              BearerAuth: [],
          },
      ],
  },
  apis: [__filename, `${__dirname}/routes/*.js`], // Path to your API route files
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Mount main router
app.use('/api', routes);

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

// AdminJS setup with dynamic import
(async () => {
  try {
    const { default: AdminJS } = await import('adminjs');
    const { buildRouter } = await import('@adminjs/express');
    const { Database, Resource } = await import('@adminjs/mongoose');

    console.log('AdminJSMongoose Database:', Database);  // Log the imported Database
    console.log('AdminJSMongoose Resource:', Resource);  // Log the imported Resource

    AdminJS.registerAdapter({ Database, Resource });

    const adminJS = new AdminJS({
      resources: [{
        resource: Course,
        options: {
          properties: {
            name: { isTitle: true },
            description: { type: 'richtext' }
          }
        }
      }],
      rootPath: '/admin',
      branding: {
        companyName: 'LMS Admin Panel',
      }
    });

    const adminRouter = buildRouter(adminJS);
    app.use(adminJS.options.rootPath, adminRouter);

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error setting up AdminJS:', err);
  }
})();
