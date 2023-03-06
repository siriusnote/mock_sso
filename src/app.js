const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const morgan = require('morgan')

const PORT = 8007

const appRouter = require('./routes/index')
const ssoRouter = require('./routes/sso')
const apiRouter = require('./routes/api')

const app = express()

require('dotenv').config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// parse json body
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

app.use(morgan('combined'))

app.use('/', appRouter)
app.use('/sso', ssoRouter)
app.use('/public/v1', apiRouter)

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})