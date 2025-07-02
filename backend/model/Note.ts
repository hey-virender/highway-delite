import mongoose from 'mongoose';

interface INote {
  _id?: string;
  content: string;
  user_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const noteSchema = new mongoose.Schema<INote>({
  content: { type: String, required: true },
  user_id: { type: String, required: true },
}, { timestamps: true });


const Note = mongoose.models.Note || mongoose.model<INote>('Note', noteSchema);

export default Note;