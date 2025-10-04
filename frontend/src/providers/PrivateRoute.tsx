import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useUserStore } from "../store/store";
export default function PrivateRoute({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState("");
  const { setUser, logoutUser } = useUserStore();
  useEffect(() => {
    axios
      .get("https://note-app-7cn6.onrender.com/auth/check", {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        return setAuth(res.data.user);
      })
      .catch(() => {
        logoutUser();
        return setAuth("false");
      });
  }, []);
  if (auth == "") return <>loading...</>;
  if (auth == "false") return <Navigate to={"/auth/login"} />;
  return children;
}
