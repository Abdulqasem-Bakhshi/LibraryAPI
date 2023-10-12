const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const port = process.env.PORT
const swaggerUI = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load(__dirname + '/docs/swagger.yaml');
const users = require('./users/data')
const {Sequelize} = require("sequelize")
const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect:"mariadb"
})
try {
  sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.')
});
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const express = require('express');
const app = express();

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/pub', express.static(path.join(__dirname, 'public')))
app.use(express.json());

require('../src/routes/bookRoutes')(app)
// app.use('/books', bookRoutes)

// GET http://localhost:5000/
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/users', (req, res) => {
  res.send(users.getAll())
})

app.get('/users/:id', (req, res) => {
  const getUser = users.getById(req.params.id)
  if (getUser === undefined) return res.status(404).send({ error: "Not found" })
  res.send(getUser)
})


app.listen(port, () => console.log(`listening on port http://localhost:${port}`));
