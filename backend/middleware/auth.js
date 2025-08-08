const { auth, isFirebaseAvailable } = require('../config/firebase-admin');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization header' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // If Firebase is not available, use mock authentication for testing
    if (!isFirebaseAvailable || !auth) {
      console.warn('⚠️ Using mock authentication for testing');
      req.user = {
        uid: 'mock-user-id',
        email: 'test@example.com',
        name: 'Test User',
        picture: ''
      };
      return next();
    }
    
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
};

module.exports = { authenticateUser };