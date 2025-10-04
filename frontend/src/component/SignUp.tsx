import { motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserStore } from "../store/store";
export const API = axios.create({
  baseURL: "http://localhost:9000",
  withCredentials: true,
});
function SignUp() {
  const { logoutUser } = useUserStore();
  const router = useNavigate();
  const [Data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isError, setIsError] = useState({
    name: "",
    email: "",
    password: "",
  });
  const Validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!Data.name) {
      setIsError((prev) => ({
        ...prev,
        name: "Name is Required",
        email: "",
        password: "",
      }));
      return false;
    }
    if (!Data.email) {
      setIsError((prev) => ({
        ...prev,
        email: "Email is Required",
        name: "",
        password: "",
      }));
      return false;
    }

    if (!emailRegex.test(Data.email)) {
      setIsError((prev) => ({
        ...prev,
        email: "Email is not Vaild",
        name: "",
        password: "",
      }));
      return false;
    }
    return true;
  };

  const HandleSingup = async () => {
    if (!Validate()) {
      return toast.info("please fill the empty blanks");
    }
    try {
      await API.post("/api/auth/signup", {
        name: Data.name,
        email: Data.email,
        password: Data.password,
      });
      toast.success("Signup successful!");
      router("/");
    } catch (err: any) {
      logoutUser();
      console.error("Signup error:", err.response?.data?.message);
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <motion.div className="md:grid flex md:grid-cols-2 p-2 md:h-auto w-full rounded-2xl md:shadow-gray-600 md:shadow-xl">
      <motion.div className="col-span-1 flex flex-col w-full">
        <div
          className="flex justify-center md:items-center mt-4 md:mt-0"
          style={{ minHeight: "calc(100% - 50px)" }}
        >
          <motion.div
            initial={{ opacity: 0, x: 250 }}
            animate={{ opacity: [0.1, 0.3, 0.5, 0.7, 1], x: 0 }}
            transition={{ duration: 1, ease: "backOut" }}
            className="w-full md:mx-10 mx-2 md:p-2 flex flex-col gap-1"
          >
            <h2 className="font-bold md:text-xl text-3xl text-gray-900  my-2 md:my-0 md:text-start text-center">
              Sign up
            </h2>
            <p className="text-gray-400 md:text-start text-center">Sign up</p>
            <div className="mt-8 md:mt-2">
              <TextField
                label="Your Name"
                variant="outlined"
                placeholder="Enter your name"
                fullWidth
                value={Data.name}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, name: e.target.value }))
                }
                sx={{
                  input: { fontSize: "19px" },
                  label: { fontSize: "17px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              <span className="text-red-500">{isError.name}</span>
            </div>
            <div className="mt-5 md:mt-3">
              <TextField
                label="email"
                placeholder="Enter a valid email"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
                value={Data.email}
                variant="outlined"
                fullWidth
                onChange={(e) =>
                  setData((prev) => ({ ...prev, email: e.target.value }))
                }
                sx={{
                  input: { fontSize: "19px" },
                  label: { fontSize: "17px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              <span className="text-red-500">{isError.email}</span>
            </div>
            <div className="mt-5 md:mt-3">
              <TextField
                label="Password"
                placeholder="Enter a new password"
                type="password"
                variant="outlined"
                fullWidth
                value={Data.password}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, password: e.target.value }))
                }
                sx={{
                  input: { fontSize: "19px" },
                  label: { fontSize: "17px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              <span className="text-red-500">{isError.password}</span>
            </div>

            <div className="mt-5 mb-4 md:mt-2 md:mb-2">
              <Button
                variant="contained"
                color="primary"
                className="w-full"
                onClick={HandleSingup}
                sx={{
                  borderRadius: "8px",
                  fontSize: "17px",
                  fontWeight: "600 ",
                }}
              >
                {"Signup"}
              </Button>
            </div>
            <div className=" flex items-center justify-center mt-3 md:mt-1">
              <p className="text-gray-600">Already have an account??</p>{" "}
              <Link to="/auth/login" className="text-blue-700 font-semibold">
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="p-2 md:block hidden col-span-1 h-auto z-10">
        <div className="h-auto">
          <img src="/image3.jpg" alt="SideImage" className="h-auto rounded-2xl" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SignUp;
