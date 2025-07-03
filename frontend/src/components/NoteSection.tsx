import NoteComponent from "./Note";
import type { Note } from "../types";

const NoteSection = ({notes}:{notes:Note[]}) => {
  return (
    <section>
      <h1 className="font-medium text-xl py-5">Notes</h1>
      <div className="flex flex-col gap-4">
        {notes.length > 0 ? (
          notes.map((note)=>(
            <NoteComponent key={note._id} note={note} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No notes yet</h3>
            <p className="text-gray-500">
              Create your first note to get started!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default NoteSection