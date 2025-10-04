import { Outlet } from "react-router-dom";
function Auth() {
  return (
      <div className="md:flex md:justify-center w-full items-center md:max-w-[1100px] mx-auto md:px-4 md:py-6 h-screen ">
        <Outlet />
      </div>
  );
}

export default Auth;
