const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please provide username and password' 
    });
  }
  
  // Extract credentials from Basic Auth header
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  
  // Simple hardcoded credentials (you can move these to .env later)
  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'password123';
  
  if (username === validUsername && password === validPassword) {
    next(); // Authentication successful
  } else {
    res.status(401).json({ 
      error: 'Invalid credentials',
      message: 'Username or password is incorrect' 
    });
  }
};

module.exports = { basicAuth };