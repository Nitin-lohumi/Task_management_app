import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { API } from "./SignUp";
import { Tags } from "./Tags";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
interface Taskdata {
  complete: boolean;
  _id: string;
  userId: string;
  content: string;
  tags: string[];
  title: string;
}
export const Editmodel = React.memo(
  ({
    setOpen,
    open,
    taskdata,
  }: {
    setOpen: (isTrue: boolean) => void;
    open: boolean;
    taskdata: Taskdata;
  }) => {
    const [tagval, setTagval] = useState<string[]>([]);
    const [taskContent, setTaskContent] = useState("");
    const [title, setTitle] = useState("");
    const [checked, setChecked] = useState(false);
    const queryClient = useQueryClient();
    useEffect(() => {
      if (taskdata) {
        setTitle(taskdata.title);
        setTaskContent(taskdata.content);
        setTagval(taskdata.tags || []);
        setChecked(taskdata.complete);
      }
    }, [taskdata]);

    const updateTask = useMutation({
      mutationFn: ({ data }: { data: any }) =>
        API.patch(`/api/taskEdit/`, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["task"] });
        setOpen(false);
      },
      onError: (error: any) => {
        toast.error(error?.message);
        setOpen(true);
      },
    });

    const handleClose = () => setOpen(false);
    const handleSave = () => {
      if (!title || !taskContent) {
        return toast.info("fill the missing blanks");
      }
      if (
        title == taskdata.title &&
        taskContent == taskdata.content &&
        checked == taskdata.complete &&
        taskdata.tags.every((v, i) => v == tagval[i]) &&
        tagval.every((v, i) => v == taskdata.tags[i])
      ) {
        setOpen(false);
        return;
      }

      const Values = {
        userId: taskdata.userId,
        TaskId: taskdata._id,
        complete: checked,
        content: taskContent,
        tags: tagval,
        title: title,
      };
      updateTask.mutate({ data: Values });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
    };

    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className="flex gap-2 items-center">
          <span>Edit:</span>
          <span className="text-xl text-green-500 capitalize">
            {taskdata?.title}
          </span>
          <span>Task</span>
        </DialogTitle>
        <DialogContent className="flex flex-col  mt-2 gap-4">
          <TextField
            label="Task Title"
            className="!mt-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <Tags setTags={setTagval} tags={tagval} />
          <TextField
            label="Task Content"
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleChange}
                color="primary"
              />
            }
            label="completed"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="info">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {updateTask.isPending ? "saving..." : "save"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
