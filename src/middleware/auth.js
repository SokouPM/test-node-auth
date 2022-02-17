const jsonwebtoken = require("jsonwebtoken")
const UserModel = require("../models/User")

const auth = async (req, res, next) => {
  const {
    headers: { authentication },
  } = req

  try {
    const {
      payload: {
        user: { email },
      },
    } = jsonwebtoken.verify(authentication, "pierrelebogosse")

    req.user = await UserModel.query().findOne({ email })

    next()
  } catch (error) {
    console.log(error)
    res.status(401).send({ error: "Unauthorized user" })
  }
}

module.exports = auth
