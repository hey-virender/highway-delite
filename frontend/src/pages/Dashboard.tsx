
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import NoteSection from "../components/NoteSection";
import Signout from "../components/Signout";
import CreateNoteModal from "../components/CreateNoteModal";
import axiosInstance from "../hooks/axiosInstance";
import { toast } from "sonner";
import type { Note } from "../types";

const Dashboard = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Function to fetch notes (can be reused)
  const fetchNotes = useCallback(async () => {
    try {
      const notesResponse = await axiosInstance.get('/note');
      if (notesResponse.data.success) {
        setNotes(notesResponse.data.notes);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      toast.error('Failed to load notes');
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile from backend
        const response = await axiosInstance.get('/user/profile');
        if (response.data.success) {
          setUserData(response.data.user);
        }
        
        // Fetch user notes
        await fetchNotes();
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [fetchNotes]);

  // Handler for when a new note is created
  const handleNoteCreated = () => {
    fetchNotes(); // Refresh the notes list
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
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
        <h1 className="text-2xl font-bold">
          Welcome, {userData?.name || user?.firstName || 'User'}!
        </h1>
        <p className="text-2xl">
          Email: {userData?.email || user?.emailAddresses?.[0]?.emailAddress || 'N/A'}
        </p>
        
      </div>
      <div className="my-10">
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 font-semibold text-white px-4 py-4 rounded-lg w-full hover:bg-blue-600 transition-colors"
        >
          Create Note
        </button>
      </div>
      <NoteSection notes={notes} />

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onNoteCreated={handleNoteCreated}
      />
    </main>
  )
}

export default Dashboard