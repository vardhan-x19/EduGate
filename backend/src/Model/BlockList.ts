import mongoose, { Schema, Document } from 'mongoose';

export interface IBlockList extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  blockedAt: Date;
}

const BlockListSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  blockedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBlockList>('BlockList', BlockListSchema);