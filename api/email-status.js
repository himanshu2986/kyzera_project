export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const user = process.env.GMAIL_USER || 'thakurhimanshu830@gmail.com';
  return res.status(200).json({
    configured: true,
    user: user ? user.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 'Active'
  });
}

