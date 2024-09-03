import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

function Template(props) {
  const [admin, setAdmin] = useState({});
  const navigate = useNavigate();

  const [usr, setUsr] = useState("");
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(config.api_path + "/admin/info", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setAdmin(res.data.result);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const handleSignOut = () => {
    Swal.fire({
      title: "Sign out",
      text: "คุณต้องการออกจากระบบ ใช่หรือไม่",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem(config.token_name);
        navigate("/");
      }
    });
  };

  const handleChangeProfile = async () => {
    Swal.fire({
      title: "เปลี่ยนข้อมูลส่วนตัว",
      text: "ยืนยันการเปลี่ยนแปลงข้อมูล",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        const payload = {
          usr: usr,
          id: admin.id,
        };

        if (pwd !== "") {
          payload.pwd = pwd;
        }

        try {
          await axios
            .post(
              config.api_path + "/admin/changeProfile",
              payload,
              config.headers()
            )
            .then((res) => {
              if (res.data.message === "success") {
                const btns = document.getElementsByClassName("btnClose");
                for (let i = 0; i < btns.length; i++) btns[i].click();

                Swal.fire({
                  title: "เปลี่ยนแปลงข้อมูล",
                  text: "บันทึกการเปลี่ยนข้อมูลแล้ว",
                  icon: "success",
                  timer: 1000,
                }).then((res) => {
                  localStorage.removeItem(config.token_name);
                  navigate("/");
                });
              }
            })
            .catch((err) => {
              throw err.response.data;
            });
        } catch (e) {
          Swal.fire({
            title: "error",
            text: e.message,
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <>
      <div className="d-flex">
        <div
          className="bg-dark ps-2 pe-3"
          style={{
            height: "100dvh",
            width: "300px",
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <div className="text-white">
            <div className="mt-3 ms-2 text-warning h5">
              {admin.name} : {admin.level}
            </div>
            <div className="mt-3 ms-2">
              <button
                onClick={handleSignOut}
                className="btn btn-outline-warning me-2"
              >
                <i className="fa fa-times me-2"></i>
                Sign Out
              </button>
              <button
                data-bs-toggle="modal"
                data-bs-target="#modalMyInfo"
                className="btn btn-outline-info"
                onClick={(e) => setUsr(admin.usr)}
              >
                <i className="fa fa-pencil me-2"></i>
                Edit Info
              </button>
            </div>
            <hr className="mt-4" />
          </div>
          <div className="d-grid gap-3 mt-2">
            <Link
              to="/home"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-dashboard me-3"></i>
              Dashbaord
            </Link>

            <Link
              to="/reportMember"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-file-alt me-3"></i>
              รายงานคนที่สมัครใช้บริการ
            </Link>

            <Link
              to="/reportChangePackage"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-file-alt me-3"></i>
              รายงานคนที่ขอเปลี่ยน แพกเกจ
            </Link>

            <Link
              to="/reportSumSalePerDay"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-file-alt me-3"></i>
              รายงานรายได้รายวัน
            </Link>

            <Link
              to="/reportSumSalePerMonth"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-file-alt me-3"></i>
              รายงานรายได้รายเดือน
            </Link>

            <Link
              to="/reportSumSalePerYear"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-file-alt me-3"></i>
              รายงานรายได้รายปี
            </Link>

            <Link
              to="/admin"
              className="btn btn-outline-default text-secondary text-start my-menu"
            >
              <i className="fa fa-user me-3"></i>
              ผู้ใช้ระบบ
            </Link>
          </div>
        </div>
        <div
          className="p-3"
          style={{ width: "100%", overflowY: "auto", marginLeft: "300px" }}
        >
          {props.children}
        </div>
      </div>

      <Modal id="modalMyInfo" title="เปลี่ยนข้อมูลส่วนตัว">
        <div>
          <label>Username</label>
          <input
            onChange={(e) => setUsr(e.target.value)}
            value={usr}
            className="form-control"
          />
        </div>
        <div className="mt-3">
          <label>Password</label>
          <input
            onChange={(e) => setPwd(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        <div className="mt-3">
          <button onClick={handleChangeProfile} class="btn btn-primary">
            <i className="fa fa-check me-2"></i>
            บันทึก
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Template;
