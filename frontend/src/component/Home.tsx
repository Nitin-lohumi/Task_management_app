import { MdDeleteForever } from "react-icons/md";
import Button from "@mui/material/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { API } from "./SignUp";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../store/store";
function Home() {
  const query = useQueryClient();
  const { user } = useUserStore();
  const [extendedNotes, setExtendedNotes] = useState<Record<string, boolean>>(
    {}
  );
  const [notes, setNotes] = useState("");
  const { data } = useQuery({
    queryKey: ["notes"],
    queryFn: () => API.get(`/api/notes/${user?.id}`),
    staleTime: 60 * 60 * 60,
    enabled: !!user?.id,
  });
  const mutate = useMutation({
    mutationFn: () =>
      API.post("/api/notes", { content: notes, userid: user?.id }),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Created a Note Sucessfully", { autoClose: 1000 });
      setNotes("");
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong", {
        autoClose: 2000,
      });
    },
  });
  const handleCreateNote = async () => {
    if (notes == "") return;
    mutate.mutate();
  };

  const deleteMutate = useMutation({
    mutationFn: (noteId: string) =>
      API.delete(`/api/notes/${user?.id}/${noteId}`),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted successfully", { autoClose: 1000 });
    },
    onError: (error: any) => {
      toast.error("Failed to delete note" + error?.response?.data?.message, {
        autoClose: 2000,
      });
    },
  });
  const handleDelete = (noteId: string) => {
    deleteMutate.mutate(noteId);
  };
  const toggleExtend = (noteId: string) => {
    setExtendedNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };
  return (
    <div>
      <div className="shadow-gray-500 shadow-xs rounded-2xl mt-5">
        <div className="pl-3 pt-5 font-bold text-2xl">
          Welcome to our WebSite , {user?.name}
        </div>
        <p className="pl-4 pt-4 pb-5 text-gray-500 text-xl">
          email: {user?.email}
        </p>
      </div>
      <div className="w-full p-2 mt-4">
        <textarea
          name="text"
          value={notes}
          id="text"
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full outline-none border border-gray-300 shadow shadow-gray-300 rounded-2xl text-xl p-2 resize-none"
        ></textarea>
      </div>

      <div className="mt-2 p-2">
        <Button variant="contained" onClick={handleCreateNote}>
          Create Notes
        </Button>
      </div>
      <AnimatePresence>
        {data?.data.map((v: any, i: number) => {
          const isExtended = extendedNotes[v._id] || false;
          const content = isExtended ? v.content : v.content.substring(0, 150);
          return (
            <motion.div
              key={v._id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              layout
              className="flex justify-between p-2 rounded-xl mt-4 items-end shadow-xs shadow-gray-500"
            >
              <div className="w-full">
                {content}
                {v.content.length > 130 && "..."}
                <span
                  onClick={() => toggleExtend(v._id)}
                  className="inline-block font-bold text-xl text-blue-700 cursor-pointer text-nowrap"
                >
                  {v.content.length < 150 ? "" : isExtended ? " Hide" : " more"}
                </span>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => handleDelete(v._id)}
              >
                <MdDeleteForever size={26} color="red" />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default Home;
