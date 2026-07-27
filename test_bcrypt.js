const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log("Testing bcryptjs and jsonwebtoken imports inside workspace...");

bcrypt.hash("hello", 10)
  .then(hash => {
    console.log("Bcrypt hash success:", hash);
    const token = jwt.sign({ id: "test" }, "secret", { expiresIn: "1h" });
    console.log("JWT token success:", token);
  })
  .catch(err => {
    console.error("Error occurred:", err);
  });
