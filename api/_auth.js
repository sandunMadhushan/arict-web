export function checkAuth(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.split(' ')[1];
  
  // ADMIN_SECRET must be set in Vercel Environment Variables
  if (!process.env.ADMIN_SECRET) {
    console.error('ADMIN_SECRET environment variable is missing');
    return false;
  }
  
  return token === process.env.ADMIN_SECRET;
}

export function requireAuth(req, res) {
  if (!checkAuth(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
