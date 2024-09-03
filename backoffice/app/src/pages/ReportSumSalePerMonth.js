import { useEffect, useState } from "react";
import Template from "./Template";
import axios from "axios";
import config from "../config";
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import * as dayjs from "dayjs";

function ReportSumSalePerMonth() {
    const [years, setYears] = useState(() => {
        let arr = [];
        let d = new Date();
        let currentYear = d.getFullYear();
        let lastYear = currentYear - 5;

        for (let i = lastYear; i <= currentYear; i++) arr.push(i);

        return arr;
    });
    const [selectedYear, setSelectedYear] = useState(() => {
        return new Date().getFullYear();
    });
    const [results, setResults] = useState([]);
    const [arrMonths, setArrMonths] = useState(() => {
        return [
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
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const payload = {
                year: selectedYear,
            };
            await axios
                .post(
                    config.api_path + "/changePackage/reportSumSalePerMonth",
                    payload,
                    config.headers()
                )
                .then((res) => {
                    if (res.data.message === "success") {
                        setResults(res.data.results);
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

    const [selectedMonth, setSelectedMonth] = useState({});

    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">รายงานสรุปยอดขายรายเดือน</div>
                    </div>
                    <div className="card-body">
                        <div className="input-group">
                            <span className="input-group-text">ปี</span>
                            <select
                                onChange={(e) => setSelectedYear(e.target.value)}
                                value={selectedYear}
                                className="form-control"
                            >
                                {years.map((item) => (
                                    <option value={item}>{item}</option>
                                ))}
                            </select>
                            <button onClick={fetchData} className="btn btn-primary">
                                <i className="fa fa-check me-2"></i>
                                แสดงรายการ
                            </button>
                        </div>

                        <table className="mt-3 table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>เดือน</th>
                                    <th width="200px" className="text-end">
                                        ยอดขาย
                                    </th>
                                    <th width="200px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.length > 0 && results.length != undefined && results.length != {}
                                    ? results.map((item) => (
                                        <tr>
                                            <td>{arrMonths[item.month - 1]}</td>
                                            <td className="text-end">
                                                {item.sum.toLocaleString("th-TH")}
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#modalInfo"
                                                    onClick={(e) => setSelectedMonth(item)}
                                                    className="btn btn-success"
                                                >
                                                    <i className="fa fa-file-alt me-2"></i>
                                                    แสดงรายการ
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    : ""}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id="modalInfo" title="รายการ" modalSize="modal-lg">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>วันที่สมัคร</th>
                            <th>วันที่ชำระเงิน</th>
                            <th>ผู้สมัคร</th>
                            <th>package</th>
                            <th className="text-end">ค่าบริการรายเดือน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedMonth.results != undefined && selectedMonth.results.length > 0 && selectedMonth.results.length != {}
                            ? selectedMonth.results.map((item) => (
                                <tr>
                                    <td>{dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                                    <td>
                                        {dayjs(item.payDate).format("DD/MM/YYYY")} {item.payHour}.
                                        {item.payMinute}
                                    </td>
                                    <td>{item.member.name}</td>
                                    <td>{item.package ? item.package.name : 'N/A'}</td>
                                    <td className="text-end">
                                        {item.package && item.package.price
                                            ? parseInt(item.package.price).toLocaleString("th-TH")
                                            : 'N/A'}
                                    </td>
                                </tr>
                            ))
                            : ""}
                    </tbody>
                </table>
            </Modal>

        </>
    );
}

export default ReportSumSalePerMonth;
