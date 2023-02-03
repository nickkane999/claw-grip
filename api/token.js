const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    userId: user._id,
    username: user.username,
    // add any other user information you want to include in the token
  };

  //secret key to sign the token
  const secret = "mysecretkey";

  //token expiration time
  const options = { expiresIn: "1h" };

  return jwt.sign(payload, secret, options);
}

module.exports = {
  generateToken,
};
