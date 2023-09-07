require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports =
  async (req, res, next) => {

    // if (process.env.NODE_ENV !== "development")
    //   return next();

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

          // our current auth doesn't check the payload id with the
          // user_id that requested this path

          // may be pass id to next in req object
          req.auth_user_id = id;
          // now the next method has the responsibility to check

          return next();
        }
      );
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }

  }


