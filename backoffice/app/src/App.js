import { useState } from "react";
import Swal from "sweetalert2";
import config from "./config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style/SignIn.css"

function App() {
  const [usr, setUsr] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();

  const handleSingIn = async () => {
    try {
      const payload = {
        usr: usr,
        pwd: pwd,
      };
      await axios
        .post(config.api_path + "/admin/signin", payload)
        .then((res) => {
          if (res.data.message === "success") {
            localStorage.setItem(config.token_name, res.data.token);
            navigate("/home");
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      if (e.response != undefined && e.response.status != undefined) {
        if (e.response.status == 401) {
          Swal.fire({
            title: "Sing In",
            text: "username หรือ password ไม่ถูกต้อง",
            icon: "error",
          });
        }
      } else {
        Swal.fire({
          title: "error",
          text: e.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="fullscreen-container">
      <div className="left-side d-flex flex-column justify-content-center bg-white p-5">
        <div className="text-center mb-4">
          <h2 className="font-weight-bold mb-3">Sign In</h2>
          <p>Admin Pos On Cloud</p>
        </div>

        <div className="form-group">
          <input onChange={(e) => setUsr(e.target.value)} className="form-control" placeholder="Username" />
        </div>

        <div className="form-group mt-3">
          <input onChange={(e) => setPwd(e.target.value)} type="password" className="form-control" placeholder="Password" />
        </div>

        <div className="text-center mt-4">
          <button onClick={handleSingIn} className="btn btn-primary btn-block">
            Sign In
          </button>
        </div>
      </div>
    </div >
  );
}

export default App;
