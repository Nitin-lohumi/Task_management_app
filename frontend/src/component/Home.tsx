import { MdDeleteForever, MdEditSquare } from "react-icons/md";
import Button from "@mui/material/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { API } from "./SignUp";
import { Tags } from "./Tags";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../store/store";
import { Editmodel } from "./EditModal";
import FilterTag from "./FilterTag";
import { ClipLoader } from "react-spinners";
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
  const [filter, setFilterValue] = useState<{ tags: string[]; sort: number }>({
    tags: [],
    sort: 0,
  });
  const [extendedNotes, setExtendedNotes] = useState<Record<string, boolean>>(
    {}
  );
  const [notes, setNotes] = useState("");
  const [pageCount, setPageCount] = useState(1);

  const params = new URLSearchParams();
  params.append("pageCount", pageCount.toString());
  useEffect(() => {
    if (filter.tags.length && filter.sort) {
      query.invalidateQueries({ queryKey: ["task"] });
    }
  }, [filter.sort, filter.tags]);
  if (filter.tags.length) params.append("tags", filter.tags.join(","));
  if (filter.sort) params.append("sorts", filter.sort.toString());
  const url = `/api/task/${user?.id}?${params.toString()}`;
  const { data, isLoading } = useQuery({
    queryKey: ["task", filter, pageCount],
    queryFn: () => API.get(url),
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
    if (notes == "" || title == "") return;
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
  const CompleteMutation = useMutation({
    mutationFn: async ({
      taskId,
      userId,
    }: {
      taskId: string;
      userId: string;
    }) => await API.patch(`/api/taskComplete/${userId}/${taskId}`),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["task"] });
      toast.success("task Completed ! congrats");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const handleCompleteTask = (taskId: string) => {
    if (!taskId || !user?.id) {
      return;
    }
    CompleteMutation.mutate({ taskId, userId: user?.id! });
  };

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
          className="w-full outline-none  border-gray-300 shadow shadow-gray-300 rounded-2xl 
          text-xl pl-4 p-2"
        />
        <Tags tags={tags} setTags={setTags} />
        <textarea
          name="text"
          value={notes}
          id="text"
          placeholder="Enter your tasks"
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full outline-none  border-gray-300 shadow shadow-gray-300 rounded-2xl text-xl p-2 resize-none"
        ></textarea>
      </div>

      <div className="mt-2 p-2">
        <Button variant="contained" onClick={handleCreateNote}>
          Create Notes
        </Button>
      </div>
      <FilterTag
        tagsOption={data?.data?.tags || [""]}
        setFilterValue={setFilterValue}
      />
      {isLoading && (
        <ClipLoader
          size={50}
          color="blue"
          cssOverride={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
      )}
      <AnimatePresence>
        {data?.data.tasks.length ? (
          data?.data.tasks.map((v: Taskdata, i: number) => {
            const isExtended = extendedNotes[v._id] || false;
            const content = isExtended
              ? v.content
              : v.content.substring(0, 150);
            return (
              <motion.div
                key={v._id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                layout
                className={`pl-2 pr-2 rounded-xl mt-3  ${
                  v.complete && "bg-green-100"
                } flex flex-col shadow-sm shadow-gray-900`}
              >
                <div className="flex justify-between">
                  <span className="text-xl font-bold font-serif p-2 capitalize">
                    {v.title}
                  </span>
                  <span className="text-xl font-bold font-serif p-2 capitalize">
                    status:{" "}
                    <span
                      className={`${
                        v.complete ? "text-green-500" : "text-yellow-500"
                      }`}
                    >
                      {v.complete ? "Completed" : "pending"}
                    </span>
                  </span>
                </div>
                <div className="w-full border overflow-hidden flex flex-wrap text-wrap p-2 shadow-xs rounded-xl shadow-green-800">
                  <p className="w-fit flex flex-wrap text-wrap">{content}</p>
                  {v.content.length > 130 && "..."}
                  <span
                    onClick={() => toggleExtend(v._id)}
                    className="inline-block font-bold text-xl text-blue-700 cursor-pointer text-nowrap"
                  >
                    {v.content.length < 150
                      ? ""
                      : isExtended
                      ? " Hide"
                      : " more"}
                  </span>
                </div>

                <div className="flex gap-10 p-2 justify-between items-center">
                  <div
                    className={`md:flex items-center md:p-1 rounded-xl md:gap-2 gap-5`}
                  >
                    <button
                      className={`md:pl-3 border-green-500 border font-semibold pr-3 p-2 mb-3 md:mb-0 rounded-xl cursor-pointer   ${
                        v.complete && "bg-green-700 text-white"
                      } text-black`}
                      disabled={v.complete}
                      onClick={() => handleCompleteTask(v._id)}
                    >
                      {v.complete ? "Done " : "complete"}
                    </button>
                    <br />
                    <div className="flex gap-4 w-fit md:w-full">
                      {v?.tags.map((t, index) => {
                        return (
                          <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.9, delay: index * 0.4 }}
                            key={index}
                            className="bg-gray-500 rounded-xl w-[55px] md:w-fit text-xs text-wrap md:p-2 p-1 md:text-sm text-white cursor-pointer"
                          >
                            {"# " + t}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center w-full md:w-fit">
                    <div
                      className="cursor-pointer m-2 w-full"
                      onClick={() => handleEdit(v)}
                    >
                      <MdEditSquare size={26} color="blue" />
                    </div>
                    <div
                      className="cursor-pointer  m-2 w-full"
                      onClick={() => handleDelete(v._id)}
                    >
                      <MdDeleteForever size={26} color="red" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <>NO Task is available</>
        )}
      </AnimatePresence>
      {data?.data?.tasks?.length > 0 && (
        <div className="flex justify-evenly p-1 mt-2">
          <button
            disabled={pageCount === 1}
            onClick={() => {
              setPageCount((prev) => prev - 1);
              query.invalidateQueries({ queryKey: ["task"] });
            }}
            className={`pl-3 p-2 pr-3 rounded-xl text-white 
      ${
        pageCount === 1
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-gray-600 cursor-pointer"
      }`}
          >
            prev
          </button>

          <button
            disabled={!data?.data.next}
            onClick={() => {
              setPageCount((prev) => prev + 1);
              query.invalidateQueries({ queryKey: ["task"] });
            }}
            className={`pl-3 p-2 pr-3 rounded-xl text-white 
      ${
        !data?.data.next
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-gray-600 cursor-pointer"
      }`}
          >
            next
          </button>
        </div>
      )}

      <Editmodel setOpen={setOpen} open={open} taskdata={taskData!} />
    </div>
  );
}

export default Home;
