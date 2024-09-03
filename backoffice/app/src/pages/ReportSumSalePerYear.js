import Template from "./Template";
import axios from "axios";
import config from "../config";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import * as dayjs from 'dayjs';

function ReportsumSalePerYear() {

    const [results, setResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/changePackage/reportSumSalePerYear', config.headers()).then(res => {
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
    }

    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            รายงานรายได้รายปี
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="mt-3 table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>ปี</th>
                                    <th width="200px" className="text-end">รายได้</th>
                                    <th width="200px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.length > 0 ? results.map(item =>
                                    <tr>
                                        <td>{item.year}</td>
                                        <td className="text-end">{parseInt(item.sum).toLocaleString('th-TH')}</td>
                                        <td className="text-center">
                                            <button data-bs-toggle="modal" data-bs-target="#modalInfo" onClick={e => setSelectedResult(item)} className="btn btn-success">
                                                <i className="fa fa-file-alt me-2"></i>
                                                ดูรายการ
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
                            <th>วันที่ชำระเงิน</th>
                            <th>ผู้สมัคร</th>
                            <th>package</th>
                            <th className="text-end">ค่าบริการรายเดือน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedResult != {} && selectedResult.results != undefined && selectedResult.results.length > 0
                            ? selectedResult.results.map((item) => (
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
    )
};

export default ReportsumSalePerYear;