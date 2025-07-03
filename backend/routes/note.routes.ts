import { RequestHandler, Router } from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/note.controller';
import { verifyClerkSession } from '../middleware/verifyClerkSession';

const router = Router();

// All note routes require authentication
router.post('/create', verifyClerkSession as any, createNote as any);
router.get('/', verifyClerkSession as any, getNotes as any);
router.put('/:note_id', verifyClerkSession as any, updateNote as any);
router.delete('/:note_id', verifyClerkSession as any, deleteNote as any);

export default router;