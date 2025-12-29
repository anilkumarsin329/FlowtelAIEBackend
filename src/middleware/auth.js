const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please provide username and password' 
    });
  }
  
  try {
    // Extract credentials from Basic Auth header
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    // Get credentials from environment
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'flowtel123';
    
    console.log('Auth attempt:', { username, validUsername, passwordMatch: password === validPassword });
    
    if (username === validUsername && password === validPassword) {
      next(); // Authentication successful
    } else {
      res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Username or password is incorrect' 
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      message: 'Invalid authorization header' 
    });
  }
};

module.exports = { basicAuth };