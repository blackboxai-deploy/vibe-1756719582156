import { User } from './types';

// Note: In a real application, use environment variables
const JWT_SECRET = 'your-secret-key-change-in-production';

// Mock implementations for demo purposes
// In production, use actual bcrypt and jsonwebtoken libraries
const mockBcrypt = {
  hash: async (password: string, saltRounds: number): Promise<string> => {
    // Simple mock hash for demo
    return `$2a${saltRounds}${Buffer.from(password).toString('base64')}`;
  },
  compare: async (password: string, hash: string): Promise<boolean> => {
    // Simple mock compare for demo
    const mockHash = await mockBcrypt.hash(password, 12);
    return hash.includes(Buffer.from(password).toString('base64'));
  }
};

const mockJwt = {
  sign: (payload: any, secret: string, options: any): string => {
    // Simple mock JWT for demo
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payloadStr = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
    const signature = Buffer.from(`${secret}-${header}-${payloadStr}`).toString('base64url').substring(0, 43);
    return `${header}.${payloadStr}.${signature}`;
  },
  verify: (token: string, secret: string, options: any): any => {
    try {
      const [header, payload, signature] = token.split('.');
      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
      
      // Check if token is expired
      if (decodedPayload.exp && decodedPayload.exp < Date.now()) {
        throw new Error('Token expired');
      }
      
      return decodedPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'provider' | 'customer';
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await mockBcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await mockBcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  return mockJwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
    issuer: 'bookingsaas',
    audience: 'bookingsaas-users'
  });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = mockJwt.verify(token, JWT_SECRET, {
      issuer: 'bookingsaas',
      audience: 'bookingsaas-users'
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

// Generate secure random string for booking slugs
export function generateBookingSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function isValidPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Generate API key for webhook endpoints
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'bks_';
  
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}