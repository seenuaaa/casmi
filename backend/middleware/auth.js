const { auth } = require('../config/firebase-admin');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization header' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
};

module.exports = { authenticateUser };