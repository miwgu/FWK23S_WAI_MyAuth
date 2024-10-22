module.exports = (req, res, next) => {
    const clientCsrfToken = req.headers['x-csrf-token']; // CSRF token from request header
    const serverCsrfToken = req.cookies['csrfToken'];     // CSRF token from cookie

    if (!clientCsrfToken || clientCsrfToken !== serverCsrfToken) {
        return res.status(403).send('Invalid CSRF token');
    }

    next(); // proceed to the next middleware/route
};