import Swal from "sweetalert2";
import Template from "./Template";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import * as dayjs from "dayjs";

function ReportMember() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(config.api_path + "/member/list", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setMembers(res.data.results);
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

  return (
    <>
      <Template>
        <div className="card">
          <div className="card-header">รายงานคนที่สมัครใช้บริการ</div>
          <div className="card-body">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>เบอร์โทร</th>
                  <th>วันที่สมัคร</th>
                  <th>แพกเกจ</th>
                </tr>
              </thead>
              <tbody>
                {members.length > 0
                  ? members.map((item) => (
                      <tr>
                        <td>{item.name}</td>
                        <td>{item.phone}</td>
                        <td>
                          {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                        </td>
                        <td>{item.package.name}</td>
                      </tr>
                    ))
                  : ""}
              </tbody>
            </table>
          </div>
        </div>
      </Template>
    </>
  );
}

export default ReportMember;
