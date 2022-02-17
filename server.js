const express = require("express")
const { default: knex } = require("knex")
const { Model } = require("objection")
const knexfile = require("./knexfile")
const usersRoutes = require("./src/routes/User")

const app = express()
const port = 3001
const db = knex(knexfile)

Model.knex(db)

app.use(express.json())

usersRoutes({ app })

app.listen(port, () => console.log(`Listening on :${port}`))
