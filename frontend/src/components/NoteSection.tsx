import Note from "./Note"


const NoteSection = ({notes}:{notes:Note[]}) => {
  return (
    <section>
      <h1 className="font-medium text-xl py-5">Notes</h1>
      <div className="flex flex-col gap-4">
        {notes.map((note)=>(
          <Note key={note._id} note={note} />
        ))}
      </div>
    </section>
  )
}

export default NoteSection