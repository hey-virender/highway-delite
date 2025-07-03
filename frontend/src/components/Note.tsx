import { Trash2 } from "lucide-react";
import type { Note } from "../types";
import { toast } from "sonner";
import axiosInstance from "../hooks/axiosInstance";

interface NoteProps {
  note: Note;
}

const handleDelete = async(id:string)=>{
  try {
    const response = await axiosInstance.delete(`/note/${id}`);
    if(response.status === 200){
      toast.success("Note deleted successfully");
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
    toast.error("Error while deleting note")
  }
}




const NoteComponent = ({note}:NoteProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
      <p>{note.content}</p>
      <button onClick={()=>handleDelete(note._id!)}><Trash2/></button>
    </div>
  )
}

export default NoteComponent;