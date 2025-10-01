import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function AuthProtectedRoute({ children }) {
  const { isUserLoggedIn } = useContext(AuthContext);

  return <>{!isUserLoggedIn ? children : <Navigate to={"/"}></Navigate>}</>;
}
