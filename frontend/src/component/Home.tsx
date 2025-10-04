import { MdDeleteForever, MdEditSquare } from "react-icons/md";
import Button from "@mui/material/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { API } from "./SignUp";
import { Tags } from "./Tags";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../store/store";
import { Editmodel } from "./EditModal";
interface Taskdata {
  complete: boolean;
  _id: string;
  userId: string;
  content: string;
  tags: string[];
  title: string;
}
function Home() {
  const [tags, setTags] = useState<string[]>([]);
  const query = useQueryClient();
  const { user } = useUserStore();
  const [taskData, setTaskData] = useState<Taskdata>();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [extendedNotes, setExtendedNotes] = useState<Record<string, boolean>>(
    {}
  );
  const [notes, setNotes] = useState("");
  const { data } = useQuery({
    queryKey: ["task"],
    queryFn: () => API.get(`/api/task/${user?.id}`),
    staleTime: 60 * 60 * 60,
    enabled: !!user?.id,
  });
  const mutate = useMutation({
    mutationFn: () =>
      API.post("/api/task", {
        content: notes,
        userid: user?.id,
        tag: tags,
        title,
      }),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["task"] });
      toast.success("Created a Note Sucessfully", { autoClose: 1000 });
      setNotes("");
      setTags([]);
      setTitle("");
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
      API.delete(`/api/task/${user?.id}/${noteId}`),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["task"] });
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

  const handleEdit = (v: Taskdata) => {
    if (!v._id) {
      return toast.error("task Id is not comming");
    }
    setTaskData(v);
    setOpen(true);
  };
  
  const handleCompleteTask =()=>{

  }
  return (
    <div>
      <div className="shadow-gray-500 shadow-xs rounded-2xl mt-5">
        <div className="pl-3 pt-5 font-bold text-2xl">
          Welcome , {user?.name}
        </div>
        <p className="pl-4 pt-4 pb-5 text-gray-500 text-xl">
          email: {user?.email}
        </p>
      </div>
      <div className="w-full p-2 mt-4">
        <input
          placeholder="Enter title of task"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full outline-none border border-gray-300 shadow shadow-gray-300 rounded-2xl 
          text-xl pl-4 p-2"
        />
        <Tags tags={tags} setTags={setTags} />
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
      {data?.data?.tasks?.length && <>Filter</>}
      <AnimatePresence>
        {data?.data.tasks.map((v: Taskdata, i: number) => {
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
              className="pl-2 pr-2 rounded-xl mt-3 flex flex-col shadow-xs shadow-gray-800"
            >
              <span className="text-xl font-bold font-serif p-2 capitalize">
                {v.title}
              </span>
              <div className="w-full flex flex-wrap p-2 shadow-xs rounded-xl shadow-green-800">
                {content}
                {v.content.length > 130 && "..."}
                <span
                  onClick={() => toggleExtend(v._id)}
                  className="inline-block font-bold text-xl text-blue-700 cursor-pointer text-nowrap"
                >
                  {v.content.length < 150 ? "" : isExtended ? " Hide" : " more"}
                </span>
              </div>

              <div className="flex gap-10 p-2 justify-between items-center">
                <div
                  className={`flex items-center gap-2 ${
                    v.complete && "bg-green-200"
                  }`}
                >
                  <button
                    className={`border pl-3 pr-3 p-2 rounded-xl  ${
                      v.complete && "cursor-pointer bg-green-700 text-white"
                    } text-black`}
                    disabled={v.complete}
                    onClick={() => {}}
                  >
                    {v.complete ? "Done" : "complete"}
                  </button>
                  <div>
                    {v.tags.map((t, index) => {
                      return (
                        <motion.div
                          key={index}
                          className="bg-gray-500 rounded-xl p-1 text-white cursor-pointer"
                        >
                          {"#" + t}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center">
                  <div
                    className="cursor-pointer m-2"
                    onClick={() => handleEdit(v)}
                  >
                    <MdEditSquare size={26} color="blue" />
                  </div>
                  <div
                    className="cursor-pointer  m-2"
                    onClick={() => handleDelete(v._id)}
                  >
                    <MdDeleteForever size={26} color="red" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <Editmodel setOpen={setOpen} open={open} taskdata={taskData!} />
    </div>
  );
}

export default Home;
