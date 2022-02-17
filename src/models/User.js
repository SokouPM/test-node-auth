const { Model } = require("objection")

class UserModel extends Model {
  static tableName = "users"
}

module.exports = UserModel
