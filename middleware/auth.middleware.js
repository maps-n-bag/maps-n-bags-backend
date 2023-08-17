require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports =
  async (req, res) => {

    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (token == null) return res.status(401).json({ msg: "no token" });

      jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, payload) => {
          if (err) return res.status(403).json({ msg: "token not valid" });
          const { id } = payload;

          if (req.body.id !== id) return res.status(401).json({ msg: "not authorized" });
          next();
        }
      );
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }

  }


