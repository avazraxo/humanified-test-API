const express = require('express');
const connectDb = require("./config/db");
const { post, user } = require("./routes/index");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const jwt = require('./config/jwt');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
connectDb();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(jwt());

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Humanified API',
            description: "A REST API built with Express and MongoDB. This API provides the ability to login to the APP, view your profile and CRUD posts."
        },
    },
    apis: [
        "./routes/post.js",
        "./routes/user.js"
    ]
}

app.use('/api/v1/posts', post)
app.use('/api/v1/users', user)

app.use(errorHandler);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.listen(process.env.PORT || 7070, () => console.log('Up and running'));
