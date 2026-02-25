// Local Authentication System
import { getUsers, saveUsers, getCurrentUser, setCurrentUser, generateId, initializeStorage, type User } from './localStorage';

// Initialize storage on load
initializeStorage();

// Password hashing (simple for demo - use bcrypt in production)
const hashPassword = (password: string): string => {
  return btoa(password); // Base64 encoding for demo
};

const verifyPassword = (password: string, hash: string): boolean => {
  return btoa(password) === hash;
};

// Sign up
export const signUp = async (email: string, password: string, fullName: string, phone?: string, requestedRole?: 'admin' | 'tenant') => {
  const users = getUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    throw new Error('User with this email already exists');
  }

  // Determine role - TEMPORARILY allow anyone to be admin if requested
  // If requestedRole is provided, use it; otherwise default to tenant
  const role = requestedRole || 'tenant';

  // Create new user
  const newUser: User & { password: string } = {
    id: generateId('user'),
    email,
    full_name: fullName,
    phone,
    role,
    created_at: new Date().toISOString(),
    password: hashPassword(password),
  };

  users.push(newUser as any);
  saveUsers(users);

  // Auto login
  const userWithoutPassword = { ...newUser };
  delete (userWithoutPassword as any).password;
  setCurrentUser(userWithoutPassword);

  return { user: userWithoutPassword };
};

// Sign in
export const signIn = async (email: string, password: string) => {
  const users = getUsers() as any[];
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!verifyPassword(password, user.password)) {
    throw new Error('Invalid email or password');
  }

  // Set current user
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;
  setCurrentUser(userWithoutPassword);

  return { user: userWithoutPassword };
};

// Sign out
export const signOut = async () => {
  setCurrentUser(null);
};

// Get current user
export const getAuthUser = (): User | null => {
  return getCurrentUser();
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

// Update user profile
export const updateUserProfile = (userId: string, updates: Partial<User>) => {
  const users = getUsers() as any[];
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) {
    throw new Error('User not found');
  }

  users[index] = { ...users[index], ...updates };
  saveUsers(users);

  // Update current user if it's the same user
  const currentUser = getCurrentUser();
  if (currentUser?.id === userId) {
    setCurrentUser(users[index]);
  }

  return users[index];
};
