const get_user_info = require('../model/user');
const { use } = require('../routes/event_route');
const get_user_infoController = async (req, res) => {
    user_id = req.query.id;
    const user_info = await get_user_info(user_id);
    res.json(user_info);
};
module.exports = get_user_infoController;