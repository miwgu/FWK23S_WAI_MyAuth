/**
 * Do not use this
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (req, res, next) => {
    const clientCsrfToken = req.headers['x-csrf-token']; // CSRF token from request header
    const serverCsrfToken = req.session.csrfToken;      // CSRF token from session
    const csrfTokenExpiry = req.session.csrfTokenExpiry;

    if (!clientCsrfToken || clientCsrfToken !== serverCsrfToken || Date.now()> csrfTokenExpiry) {
        return res.status(403).send('Invalid or expired CSRF token');
    }

    next(); // proceed to the next middleware/route
};