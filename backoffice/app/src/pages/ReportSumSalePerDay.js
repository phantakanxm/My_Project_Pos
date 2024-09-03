import config from "../config";
import Template from "./Template";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "../components/Modal";
import * as dayjs from 'dayjs';
function ReportSumSalePerDay() {

    const [arrYears, setArrYears] = useState(() => {
        let arr = [];
        let d = new Date();
        let currentYear = d.getFullYear();
        let lastYear = currentYear - 5;

        for (let i = lastYear; i <= currentYear; i++) {
            arr.push(i);
        }
        return arr;
    })

    const [selectedYear, setSelectedYear] = useState(() => {
        return new Date().getFullYear();
    });

    const [arrMonths, setArrMonths] = useState(() => {
        const arr = [
            'มกราคม',
            'กุมภาพันธ์',
            'มีนาคม',
            'เมษายน',
            'พฤษภาคม',
            'มิถุนายน',
            'กรกฏาคม',
            'สิงหาคม',
            'กันยายน',
            'ตุลาคม',
            'พฤศจิกายน',
            'ธันวาคม'
        ];
        return arr;
    });

    const [selectedMonth, setSelectedMonth] = useState(() => {
        return new Date().getMonth() + 1;
    });

    const [results, setResults] = useState([]);

    const handleShowReport = async () => {
        try {
            //ส่งค่าไป
            const payload = {
                month: selectedMonth,
                year: selectedYear
            }
            await axios.post(config.api_path + '/changePackage/reportSumSalePerDay', payload, config.headers()).then(res => {
                if (res.data.message === "success") {
                    setResults(res.data.results);
                }
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    };

    const [selectedDay, setSelectedDay] = useState({});

    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">รายงานยอดขายรายวัน</div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-4">
                                <div className="input-group">
                                    <span className="input-group-text">ปี</span>
                                    <select onChange={e => setSelectedDay(e.target.value)} value={selectedYear} className="form-control">
                                        {arrYears.map(item => (
                                            <option value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="input-group">
                                    <span className="input-group-text">เดือน</span>

                                    <select onChange={e => setSelectedMonth(e.target.value)} value={selectedMonth} className="form-control">
                                        {arrMonths.map((item, index) => (
                                            <option value={index + 1}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-4">
                                <button onClick={handleShowReport} className="btn btn-primary">
                                    <i className="fa fa-check me-2"></i>
                                    แสดงรายการ
                                </button>
                            </div>
                        </div>

                        <table className="table table-bordered table-striped mt-3">
                            <thead>
                                <tr>
                                    <th width="200px">วันที่</th>
                                    <th className="text-end">ยอดรวมรายได้</th>
                                    <th width="200px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.length > 0 ? results.map(item =>
                                    <tr>
                                        <td>{item.day}</td>
                                        <td className="text-end">{parseInt(item.sum).toLocaleString('th-TH')}</td>
                                        <td className="text-center">
                                            <button onClick={e => setSelectedDay(item)} data-bs-toggle="modal" data-bs-target='#modalInfo' className="btn btn-success">
                                                <i className="fa fa-file-alt me-2"></i>
                                                แสดงรายการ
                                            </button>
                                        </td>
                                    </tr>
                                ) : ''}
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
                            <th>วันที่ชําระเงิน</th>
                            <th>ผู้สมัคร</th>
                            <th>package</th>
                            <th className="text-end">ค่าบริการรายเดือน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedDay.results != undefined ? selectedDay.results.map(item =>
                            <tr>
                                <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                <td>{dayjs(item.payDate).format('DD/MM/YYYY')} {item.payHour}.{item.payMinute}</td>
                                <td>{item.member.name}</td>
                                <td>{item.package.name}</td>
                                <td className="text-end">{parseInt(item.package.price).toLocaleString('th-TH')}</td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>
        </>
    )
}
export default ReportSumSalePerDay;
