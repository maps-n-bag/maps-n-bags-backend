const client = require('../db/connect');
const get_user_info = async (id) => {
    try {
        const query = {
            text: 'SELECT username,first_name,last_name,email,profile_pic,cover_pic FROM public.user WHERE id = $1',
            values: [id]
        };
        const { rows } = await client.query(query);
        return rows[0];
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};
module.exports = get_user_info;