import { useNavigate } from "react-router-dom";
import { API } from "./SignUp";
import { toast } from "react-toastify";
import { useUserStore } from "../store/store";
function Header() {
  const { logoutUser } = useUserStore();
  const navigate = useNavigate();
  const handleSignout = async () => {
    try {
      await API.get("/auth/logout");
      navigate("/auth/login");
      toast.success("logout sucess");
      logoutUser();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex justify-between items-center w-full p-2 md:mt-1 mt-3">
      <div className="flex justify-center items-center">
        <p className="text-xl md:font-semibold font-bold">DashBord</p>
      </div>
      <div
        className="text-blue-600 underline cursor-pointer"
        onClick={handleSignout}
      >
        signout
      </div>
    </div>
  );
}

export default Header;
