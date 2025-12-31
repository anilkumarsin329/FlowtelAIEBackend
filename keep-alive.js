// Keep-alive utility to prevent Vercel cold starts
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://flowtelaiebackend-ai.onrender.com';

let keepAliveInterval;

export const startKeepAlive = () => {
  // Ping every 4 minutes to keep server warm
  keepAliveInterval = setInterval(async () => {
    try {
      await fetch(`${BACKEND_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Keep-alive ping sent');
    } catch (error) {
      console.log('Keep-alive ping failed:', error.message);
    }
  }, 240000); // 4 minutes
};

export const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
};

// Auto-start keep-alive
if (typeof window !== 'undefined') {
  startKeepAlive();
}