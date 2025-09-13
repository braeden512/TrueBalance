// handles authentication register/login logic
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel.js';

// register logic controller
export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // check if all fields are filled
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // check if password matches retype password
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const userId = await createUser(email, hashedPassword);

    // create jwt
    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(201).json({ message: 'User registered', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// register logic controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if all fields are filled
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // check if the email is valid
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // check if credentials are valid
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // create jwt
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
