import { Navigate, useSearchParams } from "react-router-dom";

/** /register opens the compact register panel on the login page. */
export default function Register() {
  const [params] = useSearchParams();
  const error = params.get("error");
  const query = new URLSearchParams({ view: "register" });
  if (error) query.set("error", error);
  return <Navigate to={`/login?${query.toString()}`} replace />;
}
