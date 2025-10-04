import { Outlet } from "react-router-dom";
import Header from "./component/Header";

function App() {
  return (
    <div className="flex flex-col w-full md:max-w-[1300px] mx-auto md:px-2 md:py-2 h-screen">
      <header className="w-full ">
        <Header />
      </header>
      <main className="p-2">
        <Outlet />
      </main>
    </div>
  );
}
export default App;
