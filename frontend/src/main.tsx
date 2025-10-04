import "./index.css";
import { createRoot } from "react-dom/client";
import RouteProvider from "./providers/RouteProvider.tsx";
import QueryProvider from "./providers/QueryProvider.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
createRoot(document.getElementById("root")!).render(
  <>
    <QueryProvider>
      <RouteProvider />
      <ToastContainer position="top-right" autoClose={3000} />
    </QueryProvider>
  </>
);
