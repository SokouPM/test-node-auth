const UserModel = require("../models/User")
const jsonwebtoken = require("jsonwebtoken")
const hashPassword = require("../hashPassword")
const auth = require("../middleware/auth")

const usersRoutes = ({ app }) => {
  // READ collection
  app.get("/users", auth, async (req, res) => {
    const users = await UserModel.query()

    if (!users.length) {
      res.status(404).send({ error: "No user found" })

      return
    }

    res.send(users)
  })

  // READ single
  app.get("/users/:userId", auth, async (req, res) => {
    const {
      params: { userId },
    } = req

    const user = await UserModel.query().findById(userId)

    if (!user) {
      res.status(404).send({ error: "User not found" })

      return
    }

    res.send(user)
  })

  // CREATE / REGISTER
  app.post("/users/sign-up", async (req, res) => {
    const {
      body: { email, password },
    } = req

    const user = await UserModel.query().findOne({ email })

    if (user) {
      res.send({ status: "OK" })

      return
    }

    const [hash, salt] = hashPassword(password)

    await UserModel.query().insert({
      email,
      passwordHash: hash,
      passwordSalt: salt,
    })

    res.send({ status: "Ok" })
  })

  // LOGIN
  app.post("/users/sign-in", async (req, res) => {
    const {
      body: { email, password },
    } = req

    const user = await UserModel.query().findOne({ email })

    if (!user) {
      res.status(401).send({ status: "User not found" })

      return
    }

    const [hash] = hashPassword(password, user.passwordSalt)

    if (hash !== user.passwordHash) {
      res.status(401).send({ status: "Invalid password" })

      return
    }

    const jwt = jsonwebtoken.sign(
      {
        payload: {
          user: {
            id: user.id,
            email: user.email,
          },
        },
      },
      "pierrelebogosse",
      { expiresIn: "2 days" }
    )

    res.send(jwt)
  })

  // UPDATE
  app.put("/users/:userId", auth, async (req, res) => {
    const {
      params: { userId },
      body: { email, password_hash },
    } = req

    const user = await UserModel.query().updateAndFetchById(userId, {
      email,
      password_hash,
    })

    if (!user) {
      res.status(404).send({ error: "User not found" })

      return
    }

    res.send(user)
  })

  // DELETE
  app.delete("/users/:userId", auth, async (req, res) => {
    const {
      params: { userId },
    } = req

    const user = await UserModel.query().findById(userId)

    if (!user) {
      res.status(404).send({ error: "User not found" })

      return
    }

    await UserModel.query().delete().where({ id: userId })

    res.send({ status: "User deleted." })
  })
}

module.exports = usersRoutes
