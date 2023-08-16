const models = require('../db/models');
const bcrypt = require('bcrypt');

module.exports = {
    get:
    async (req, res) => {
        const user_id = req.query.id;
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

    post:
    async (req, res) => {

        try {
            // console.log('req.body: ', req.body);
            const { username, first_name, last_name, email, password, profile_pic, cover_pic } = req.body;
            const hashedPassword = bcrypt.hashSync(password, 10);

            try {
                const user = await models.User.create({
                    username,
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                    profile_pic,
                    cover_pic
                });
                res.status(201).send(user);

            } catch (e) {
                console.log('User post error: ', e);
                res.status(500).send('Internal server error');
            }

        } catch (e) {
            console.log('User post error: ', e);
            res.status(400).send('Bad request');
        }
    },

    put:
    async (req, res) => {

        try {
            const user_id = req.query.id;
            const { username, first_name, last_name, email, password, profile_pic, cover_pic } = req.body;
            const hashedPassword = bcrypt.hashSync(password, 10);

            try {
                const user = await models.User.findByPk(user_id);
                if (user) {
                    await user.update({
                        username,
                        first_name,
                        last_name,
                        email,
                        password: hashedPassword,
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
    }
}
