const adminMiddleware = (req, res, next) => {
    // Check if user exists and is an admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied." })
    }
  
    next()
  }
  
module.exports = adminMiddleware
  