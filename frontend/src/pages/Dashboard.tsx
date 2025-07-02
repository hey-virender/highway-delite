
import NoteSection from "../components/NoteSection"
import Signout from "../components/Signout"

const notes =[
  {id:1, content:"This is the first note", user_id:"1"},
  {id:2, content:"This is the second note", user_id:"1"},
  {id:3, content:"This is the third note", user_id:"1"},
  {id:4, content:"This is the fourth note", user_id:"1"},
  {id:5, content:"This is the fifth note", user_id:"1"},
  {id:6, content:"This is the sixth note", user_id:"1"},
  {id:7, content:"This is the seventh note", user_id:"1"},
]
const Dashboard = () => {
  return (
    <main className="px-5">
      <header className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" />
          <h1 className="text-xl font-medium">Dashboard</h1> 
        </div>
        <div>
          <Signout />
        </div>
      </header>
      <div className="mt-10 shadow-md px-3 py-9 rounded-lg flex flex-col gap-8">
        <h1 className="text-2xl font-bold">Welcome, Virender Chauhan!</h1>
        <p className="text-2xl">Email: virender@gmail.com</p>
      </div>
      <div className="my-10">
        <button className="bg-blue-500 font-semibold text-white px-4 py-4 rounded-lg w-full ">Create Note</button>
      </div>
      <NoteSection notes={notes} />
    </main>
  )
}

export default Dashboard