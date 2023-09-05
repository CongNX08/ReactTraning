import { Routes, Route } from "react-router-dom";
import Home from "../component/Home";
import Login from "../component/Login";
import TableUsers from "../component/TableUsers";
import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <TableUsers />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default AppRoutes;
