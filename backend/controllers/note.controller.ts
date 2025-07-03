import { Request, Response } from 'express';
import Note from '../model/Note';


export const createNote = async (req: any, res: Response) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    // Get user_id from authenticated user (set by middleware)
    const user_id = req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const newNote = await Note.create({ content: content.trim(), user_id });
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note: newNote
    });
  } catch (error) {
    console.log(error as Error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getNotes = async (req: any, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    const notes = await Note.find({ user_id }).sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json({
      success: true,
      notes
    });
  } catch (error) {
    console.log(error as Error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateNote = async (req: any, res: Response) => {
  try {
    const { note_id } = req.params;
    const { content } = req.body;
    const user_id = req.user?.user_id;
    const note = await Note.findOne({ _id: note_id, user_id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const updatedNote = await Note.findByIdAndUpdate(note_id, { content }, { new: true });
    res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
  } catch (error) {
    console.log(error as Error);
  }
}

export const deleteNote = async (req: any, res: Response) => {
  try {
    const { note_id } = req.params;
    const user_id = req.user?.user_id;
    const note = await Note.findOne({ _id: note_id, user_id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    await Note.findByIdAndDelete(note_id);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.log(error as Error);
  }
}