import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    message: { type: String }, // 👈 Optional message
    recommendedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;
