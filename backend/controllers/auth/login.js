import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../../models/user/index.js';

// login logic controller
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
