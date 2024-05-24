require('dotenv').config()
require('express-async-errors')

//extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

// Swagger
const swagger = require('swagger-ui-express')
const YAML = require('yamljs')
// lading the swagger.yaml file
const swaggerDocs = YAML.load('./swagger.yaml')

const express = require('express');
const app = express();

// connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')
// routers
const authRouter  = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//Enable if behind proxy (heroku)
app.set('trust proxy', 1);

app.use(rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
}))

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// Home Route
app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-documentation">Documentation</a>');
});
// swagger middleware
app.use('/api-documentation', swagger.serve, swagger.setup(swaggerDocs))
// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
