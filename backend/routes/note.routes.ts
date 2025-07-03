import { RequestHandler, Router } from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/note.controller';
import { verifyClerkSession } from '../middleware/verifyClerkSession';

const router = Router();

// All note routes require authentication
router.post('/create', verifyClerkSession as RequestHandler, createNote as RequestHandler);
router.get('/', verifyClerkSession as RequestHandler, getNotes as RequestHandler);
router.put('/:note_id', verifyClerkSession as RequestHandler, updateNote as RequestHandler);
router.delete('/:note_id', verifyClerkSession as RequestHandler, deleteNote as RequestHandler);

export default router;