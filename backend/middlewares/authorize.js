const authorize = (roles = []) => {
    return (req, res, next) => {
        if (typeof roles !== 'object') {
            roles = [roles];
        }
        if (!roles.includes(req.user?.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    }
}

export default authorize;