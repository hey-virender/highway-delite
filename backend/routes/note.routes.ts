import { RequestHandler, Router } from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/note.controller';

const router = Router();

router.post('/create', createNote as RequestHandler);
router.get('/:user_id', getNotes as RequestHandler);
router.put('/:note_id', updateNote as RequestHandler);
router.delete('/:note_id', deleteNote as RequestHandler);

export default router;