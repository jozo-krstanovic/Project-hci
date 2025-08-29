import { config } from 'dotenv';
config();

import express from 'express';
import passport from 'passport';
import localStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use(new localStrategy((username, password, done) => {
  const users = [
    { id: 1, username: 'admin@admin.com', password: 'password' },
    { id: 2, username: 'user@user.com', password: 'password' },
  ];

  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    return done(null, user);
  }

  return done(null, false, { message: 'Incorrect username or password' });
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // TO DO: implement deserialization logic here
});

app.post('/api/login', passport.authenticate('local', { session: false }), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.send({ token });
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  // TO DO: implement registration logic here
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});