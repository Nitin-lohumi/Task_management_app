import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error: any = useRouteError();
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1> Oops! Something went wrong.</h1>
      <p>
        {error?.statusText || error?.message || "Unexpected error occurred."}
      </p>
      <pre style={{ color: "red", marginTop: "1rem" }}>
        {JSON.stringify(error, null, 2)}
      </pre>
    </div>
  );
}

export default ErrorPage;
