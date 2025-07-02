import { Request, Response } from 'express';
import Note from '../model/Note';


export const createNote = async (req:Request, res:Response) => {
  try {
    const {content} = req.body;
    const {user_id} = req.params;
    const newNote = await Note.create({content, user_id});
    res.status(201).json({message: 'Note created successfully', note: newNote});
  } catch (error) {
    console.log(error as Error);
  }
}

export const getNotes = async (req:Request, res:Response) => {
  try {
    const {user_id} = req.params;
    const notes = await Note.find({user_id});
    res.status(200).json({notes});
  } catch (error) {
    console.log(error as Error);
  }
}

export const updateNote = async (req:Request, res:Response) => {
  try {
    const {note_id} = req.params;
    const {content} = req.body;
    const updatedNote = await Note.findByIdAndUpdate(note_id, {content}, {new: true});
    res.status(200).json({message: 'Note updated successfully', note: updatedNote});
  } catch (error) {
    console.log(error as Error);
  }
}

export const deleteNote = async (req:Request, res:Response) => {
  try {
    const {note_id} = req.params;
    await Note.findByIdAndDelete(note_id);
    res.status(200).json({message: 'Note deleted successfully'});
  } catch (error) {
    console.log(error as Error);
  }
}