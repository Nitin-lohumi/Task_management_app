import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserStore } from "../store/store";
export default function PublicRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { setUser, logoutUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get("http://localhost:9000/auth/check", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.isLoggedIn) {
          setUser(res.data.user);
          navigate("/");
        }
        setLoading(false);
      })
      .catch(() => {
        logoutUser();
        setLoading(false);
      });
  }, [navigate]);
  if (loading) return <>Wait Authenticating... /</>;
  return children;
}
