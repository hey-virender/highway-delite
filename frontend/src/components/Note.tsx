import { Trash2 } from "lucide-react";

interface NoteProps {
  note: Note;
  
}
const handleDelete = (id:string)=>{
  console.log(id);
}

const Note = ({note}:NoteProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
      <p>{note.content}</p>
      <button onClick={()=>handleDelete(note._id!)}><Trash2/></button>
    </div>
  )
}

export default Note