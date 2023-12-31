require('dotenv').config();

const models = require('../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {

  getUser:
    async (req, res) => {
      // console.log("uid: ", uid);
      const user_id = req.query.id;
      // if (user_id !== uid) return res.status(401).json({ msg: "not authorized" });
      try {
        const user = await models.User.findByPk(user_id);
        if (user) {
          res.send(user);
        } else {
          res.status(404).send('User not found');
        }
      } catch (e) {
        console.log('User get error: ', e);
        res.status(500).send('Internal server error');
      }
    },

  createUser:
    async (req, res) => {

      try {
        // console.log('req.body: ', req.body);
        const { username, first_name, last_name, email, password, profile_pic, cover_pic } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        const users = await models.User.findAll();
        const usernameClash = users.find(user => user.username === username);
        const emailClash = users.find(user => user.email === email);
        if (usernameClash) {
          return res.status(409).send('Username already exists');
        }
        if (emailClash) {
          return res.status(409).send('Email already exists');
        }

        const user = await models.User.create({
          username,
          first_name,
          last_name,
          email,
          password: hashedPassword,
          profile_pic,
          cover_pic
        });
        return res.status(201).send(user);

      } catch (e) {
        console.log('User post error: ', e);
        return res.status(400).send('Bad request');
      }
    },

  updateUser:
    async (req, res) => {

      try {
        const user_id = req.query.id;
        const { username, first_name, last_name, email, profile_pic, cover_pic } = req.body;

        try {
          const user = await models.User.findByPk(user_id);
          if (user) {
            await user.update({
              username,
              first_name,
              last_name,
              email,
              profile_pic,
              cover_pic
            });
            res.status(200).send(user);
          } else {
            res.status(404).send('User not found');
          }
        } catch (e) {
          console.log('User patch error: ', e);
          res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('User patch error: ', e);
        res.status(400).send('Bad request');
      }
    },

  login:
    async (req, res) => {

      try {
        const { username, password } = req.body;
        const user = await models.User.findOne({ where: { username } });

        if (user) {
          // console.log(user);
          const match = bcrypt.compareSync(password, user.password);

          if (match) {
            const payload = { id: user.id };
            const token = jwt.sign(payload, process.env.JWT_SECRET);

            res.status(200).json({
              token,
              user_id: user.id,
            });

          } else {
            res.status(401).json({ error: 'Invalid email or password' });
          }

        } else {
          res.status(401).json({ error: 'Invalid email or password' });
        }

      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    },

  updatePassword:
    async (req, res) => {

      try {
        const user_id = req.query.user_id;
        const { old_password, new_password } = req.body;

        try {
          const user = await models.User.findByPk(user_id);
          if (user) {
            const match = bcrypt.compareSync(old_password, user.password);
            if (match) {
              const hashedPassword = bcrypt.hashSync(new_password, 10);
              await user.update({
                password: hashedPassword
              });
              res.status(200).send(user);
            } else {
              res.status(401).send('Wrong password');
            }
          } else {
            res.status(404).send('User not found');
          }
        } catch (e) {
          console.log('User patch error: ', e);
          res.status(500).send('Internal server error');
        }

      } catch (e) {
        console.log('User patch error: ', e);
        res.status(400).send('Bad request');
      }
    }
}
