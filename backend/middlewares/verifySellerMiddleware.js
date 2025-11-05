const verifySeller = async (req, res, next) => {
    try {
        const { package_id } = req.user;
        if (package_id) {
            next();
        } else {
            res.status(403).json({ error: 'Please register as a seller to access this resource.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default verifySeller;