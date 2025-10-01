import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Login from "../../Pages/Login/Login";

export default function ProtectedRoute({ children }) {
  let { isUserLoggedIn } = useContext(AuthContext);

  return <>{isUserLoggedIn ? children : <Login />}</>;
}
