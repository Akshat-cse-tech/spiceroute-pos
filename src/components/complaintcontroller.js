const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { sendStatusEmail } = require('../utils/email');

exports.getAll = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') query.createdBy = req.user.id;
    const complaints = await Complaint.find(query)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { title, category, desc, priority } = req.body;
    const complaint = new Complaint({
      title, category, desc, priority,
      createdBy: req.user.id
    });
    await complaint.save();
    res.json(complaint);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    ).populate('createdBy', 'username email');

    if (complaint?.createdBy?.email) {
      try {
        await sendStatusEmail(
          complaint.createdBy.email,
          complaint.createdBy.username,
          complaint.title,
          status
        );
      } catch (emailErr) {
        console.log('Email failed:', emailErr.message);
      }
    }
    res.json(complaint);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ msg: 'Only admin can delete' });
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const total    = await Complaint.countDocuments();
    const open     = await Complaint.countDocuments({ status: 'open' });
    const progress = await Complaint.countDocuments({ status: 'in-progress' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });
    const high     = await Complaint.countDocuments({ priority: 'high' });
    res.json({ total, open, progress, resolved, high });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};