const listUserController =  async (req, res) => {
    const [users] = await pool.query('SELECT * FROM users');
    res.status(200)
        .json({
            success: 'true',
            message: 'Users fetched successfully.',
            users
        });
}

export { listUserController}