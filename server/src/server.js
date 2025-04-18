const path = require('path')
const cors = require('cors')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });
const port = process.env.PORT || 3000
const swaggerUI = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load(__dirname + '/docs/swagger.yaml');

const express = require('express');
const app = express();
app.use(express.json())

app.use("/client", express.static(path.join(__dirname, '../../front/src')))
const busboy = require('connect-busboy');
// Default options, immediately start reading from the request stream and
// parsing
app.use(busboy({
  highWaterMark: 2 * 1024 * 1024,
  // limits: {
  //   fileSize: 10 * 1024 * 1024,
  // },
  // immediate: true
}))
// const bb = require('busboy');
// app.use(bb)
// app.use(express.urlencoded({ extended: true, limit: 10000, parameterLimit: 10 }))
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/pub', express.static(path.join(__dirname, 'public')))
app.use(cors())


require('../src/routes/userRoutes')(app)
require('../src/routes/bookRoutes')(app)
require("../src/routes/orderRoutes")(app)
// app.use('/books', bookRoutes)

// GET http://localhost:3000/
app.get('/', async (req, res) => {
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.redirect(`http://localhost:${port}/client`);
})

app.listen(port, () => {
  require("./db").sync()
    .then(console.log("Synchronized"))
    .catch((error) => {
      // console.log("Error:", error)
    })
  console.log(`listening on port http://localhost:${port}`);
})
