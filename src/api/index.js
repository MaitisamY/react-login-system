/* eslint-disable no-undef */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import pg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});

db.connect();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    httpOnly: true,
    secure: false // Set to true for secure session cookie
}));

// Routes
app.get('/user', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const result = await db.query('SELECT * FROM users WHERE id = $1 RETURNING *', [userId]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ name: user.name, email: user.email });
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
});


app.post('/login', [
    check('email').isEmail().withMessage('Invalid email'),
    check('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const result = await db.query(query, values);
        let isMatch;

        if (result.rows.length  > 0) {  
            // Check if password matches
            const user = result.rows[0];
            isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                req.session.token = token; // Store token in session
                res.status(200).json({ token });
            } else {
                return res.status(401).json({ message: 'Invalid password' });
            }
        } else {
            return res.status(401).json({ message: 'Invalid email address' });
        }
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/signup', [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email'),
    check('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const { name, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const checkerQuery = 'SELECT * FROM users WHERE email = $1';
        const checkerValue = [email];
        const checker = await db.query(checkerQuery, checkerValue);
    
        if (checker.rows.length > 0) {
            res.status(409).json({ message: 'Email already exists'});
        } else {
            const insertQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
            const insertValue = [name, email, hashedPassword];
            const insert = await db.query(insertQuery, insertValue);

            if (insert.rows.length === 0) {
                console.error('No rows inserted');
                return res.status(500).json({ message: 'Failed to create user' });
            }
            
            const user = insert.rows[0];
            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            req.session.token = token; // Store token in session
            res.status(200).json({ token });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
