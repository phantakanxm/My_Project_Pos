import Template from "./Template";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import config from "../config";
import Swal from "sweetalert2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const myDate = new Date();
  const [year, setYear] = useState(myDate.getFullYear());
  const [arrYear, setArrYear] = useState(() => {
    let arr = [];
    const y = myDate.getFullYear();
    const startYear = y - 5;

    for (let i = startYear; i <= y; i++) {
      arr.push(i);
    }

    return arr;
  });
  const [myData, setMyData] = useState([]);
  const [options, setOptions] = useState(() => {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    };
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const url = config.api_path + "/changePackage/reportSumSalePerMonth";
      const payload = {
        year: year,
      };
      await axios
        .post(url, payload, config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            const results = res.data.results;
            let arr = [];

            for (let i = 0; i < results.length; i++) {
              const item = results[i];
              arr.push(item.sum);
            }

            const labels = [
              "มกราคม",
              "กุมภาพันธ์",
              "มีนาคม",
              "เมษายน",
              "พฤษภาคม",
              "มิถุนายน",
              "กรกฏาคม",
              "สิงหาคม",
              "กันยายน",
              "ตุลาคม",
              "พฤศจิกายน",
              "ธันวาคม",
            ];

            setMyData({
              labels,
              datasets: [
                {
                  label: "ยอดขาย",
                  data: arr,
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                },
              ],
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
  };

  return (
    <>
      <Template>
        <div className="container">
          <div className="h5">Dashboard</div>
          <div className="row mt-2">
            <div className="col-4">
              <div className="input-group">
                <span className="input-group-text">ปี</span>
                <select
                  className="form-control"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  {arrYear.length > 0
                    ? arrYear.map((item) => (
                      <option value={item}>{item}</option>
                    ))
                    : ""}
                </select>
              </div>
            </div>
            <div className="col-4">
              <button onClick={fetchData} className="btn btn-primary">
                <i className="fa fa-check me-2"></i>
                แสดงรายการ
              </button>
            </div>
          </div>

          <div className="text-center mt-3">
            <div className="h5">รายงานสรุปยอดขายรายเดือน ปี {year}</div>
          </div>

          <div className="mt-3">
            {myData.datasets != null ? (
              <Bar options={options} data={myData} />
            ) : (
              ""
            )}
          </div>
        </div>
      </Template>
    </>
  );
}

export default Home;
