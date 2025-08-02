import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function signJwtToken(payload, options = { expiresIn: '7d' }) {
  return jwt.sign(payload, SECRET, options);
}

export function verifyJwtToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}
