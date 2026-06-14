const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

exports.submitFeedback = async (req, res) => {
  try {
    const { complaintId, rating, comment } = req.body;
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ msg: 'Complaint not found' });
    if (complaint.status !== 'resolved')
      return res.status(400).json({ msg: 'Can only give feedback on resolved complaints' });
    const existing = await Feedback.findOne({ complaint: complaintId, givenBy: req.user.id });
    if (existing) return res.status(400).json({ msg: 'Feedback already submitted' });
    const feedback = new Feedback({
      complaint: complaintId,
      givenBy: req.user.id,
      rating,
      comment
    });
    await feedback.save();
    res.json({ msg: 'Feedback submitted successfully', feedback });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('complaint', 'title category')
      .populate('givenBy', 'username')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ givenBy: req.user.id })
      .populate('complaint', 'title');
    res.json(feedback);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const all = await Feedback.find();
    const total = all.length;
    const avg = total ? (all.reduce((s, f) => s + f.rating, 0) / total).toFixed(1) : 0;
    const five  = all.filter(f => f.rating === 5).length;
    const four  = all.filter(f => f.rating === 4).length;
    const three = all.filter(f => f.rating === 3).length;
    const two   = all.filter(f => f.rating === 2).length;
    const one   = all.filter(f => f.rating === 1).length;
    res.json({ total, avg, five, four, three, two, one });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};