import { Container } from "react-bootstrap";
import "./App.scss";
import Header from "./component/Header";
import TableUsers from "./component/TableUsers";
import { ToastContainer, toast } from "react-toastify";
import Home from "./component/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/UserContext";

function App() {
  const { user, loginContext } = useContext(UserContext);
  console.log("Check user", user);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loginContext(
        localStorage.getItem("email"),
        localStorage.getItem("token")
      );
    }
  }, []);
  return (
    <>
      <div className="app-container">
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<TableUsers />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Container>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
