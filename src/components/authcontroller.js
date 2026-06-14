const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ msg: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = new User({ username, email, password: hashed, role });
    await user.save();
    res.json({ msg: 'Registered successfully' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role, email: user.email },
      process.env.JWT_SECRET, { expiresIn: '1d' }
    );
    res.json({ token, username: user.username, role: user.role });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};