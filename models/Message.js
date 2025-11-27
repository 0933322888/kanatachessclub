import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  gatheringDate: {
    type: Date,
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;

