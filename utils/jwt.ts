import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function generateToken(user: { id: number; steamid: string; username: string }) {
  return jwt.sign({ payload: user }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { payload: { id: number; steamid: string; username: string } } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { payload: { id: number; steamid: string; username: string } }
    return decoded
  } catch (error) {
    return null
  }
}

