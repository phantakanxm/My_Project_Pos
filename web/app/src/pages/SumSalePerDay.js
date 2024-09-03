import { useEffect, useState } from "react";
import Template from "../components/Template";
import axios from "axios";
import config from "../config";
import Swal from "sweetalert2";
import Modal from "../components/Modal";

function SumSalePerDay() {
    const [currentYear, setCurrentYear] = useState(() => {
        let myDate = new Date();
        return myDate.getFullYear();
    });

    const [arrYear, setArrYear] = useState(() => {
        let arr = [];
        let myDate = new Date();
        let currentYear = myDate.getFullYear();
        let beforeYear = currentYear - 5;

        for (let i = beforeYear; i <= currentYear; i++) {
            arr.push(i);
        }

        return arr;
    });

    const [currentMonth, setCurrentMonth] = useState(() => {
        let myDate = new Date();
        return myDate.getMonth() + 1;
    });
    const [arrMonth, setArrMonth] = useState(() => {
        return [
            { value: 1, label: 'มกราคม' },
            { value: 2, label: 'กุมภาพันธ์' },
            { value: 3, label: 'มีนาคม' },
            { value: 4, label: 'เมษายน' },
            { value: 5, label: 'พฤษภาคม' },
            { value: 6, label: 'มิถุนายน' },
            { value: 7, label: 'กรกฏาคม' },
            { value: 8, label: 'สิงหาคม' },
            { value: 9, label: 'กันยายน' },
            { value: 10, label: 'ตุลาคม' },
            { value: 11, label: 'พฤศจิกายน' },
            { value: 12, label: 'ธันวาคม' }
        ];
    });
    const [billSales, setBillSales] = useState([]);
    const [currentBillSale, setCurrentBillSale] = useState({});
    const [billSaleDetails, setBillSaleDetails] = useState([]);

    useEffect(() => {
        handleShowReport();
    }, []);

    const handleShowReport = async () => {
        try {
            const path = config.api_path + '/billSale/listByYearAndMonth/' + currentYear + '/' + currentMonth;
            await axios.get(path, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setBillSales(res.data.results);
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
                        <div className="card-title">รายงานสรุปยอดขายรายวัน</div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-3">
                                <div className="input-group">
                                    <span className="input-group-text">ปี</span>
                                    <select onChange={e => setCurrentYear(e.target.value)}
                                        value={currentYear}
                                        className="form-control">
                                        {arrYear.map(item =>
                                            <option value={item}>
                                                {item}
                                            </option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="input-group">
                                    <span className="input-group-text">เดือน</span>
                                    <select onChange={e => setCurrentMonth(e.target.value)}
                                        value={currentMonth}
                                        className="form-control">
                                        {arrMonth.map(item =>
                                            <option value={item.value}>
                                                {item.label}
                                            </option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="col-6">
                                <button onClick={handleShowReport} className="btn btn-primary">
                                    <i className="fa fa-check me-2"></i>
                                    แสดงรายการ
                                </button>
                            </div>
                        </div>

                        <table className="table table-bordered table-striped mt-3">
                            <thead>
                                <tr>
                                    <th width="180px"></th>
                                    <th width="100px" className="text-end">วันที่</th>
                                    <th className="text-end">ยอดขาย</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billSales.length > 0 ? billSales.map(item =>
                                    <tr>
                                        <td className="text-center">
                                            <button
                                                data-toggle="modal"
                                                data-target="#modalBillSale"
                                                onClick={e => setCurrentBillSale(item.results)}
                                                className="btn btn-primary">
                                                <i className="fa fa-file-alt me-2"></i>
                                                แสดงรายการ
                                            </button>
                                        </td>
                                        <td className="text-end">{item.day}</td>
                                        <td className="text-end">{item.sum.toLocaleString('th-TH')}</td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id="modalBillSale" title="บิลขาย">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th width="180px"></th>
                            <th className="text-end">เลขบิล</th>
                            <th>วันที่</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBillSale.length > 0 ? currentBillSale.map(item =>
                            <tr>
                                <td className="text-center">
                                    <button
                                        data-toggle="modal"
                                        data-target="#modalBillSaleDetail"
                                        onClick={e => setBillSaleDetails(item.billSaleDetails)}
                                        className="btn btn-primary">
                                        <i className="fa fa-file-alt me-2"></i>
                                        แสดงรายการ
                                    </button>
                                </td>
                                <td className="text-end">{item.id}</td>
                                <td>{item.createdAt}</td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>

            <Modal id="modalBillSaleDetail" title="รายละเอียดบิลขาย" modalSize="modal-lg">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>รายการ</th>
                            <th className="text-end">ราคา</th>
                            <th className="text-end">จำนวน</th>
                            <th className="text-end">ยอดรวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billSaleDetails.length > 0 ? billSaleDetails.map(item =>
                            <tr>
                                <td>{item.product.name}</td>
                                <td className="text-end">{parseInt(item.price).toLocaleString('th-TH')}</td>
                                <td className="text-end">{item.qty}</td>
                                <td className="text-end">
                                    {(item.price * item.qty).toLocaleString('th-TH')}
                                </td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>
        </>
    )
}

export default SumSalePerDay;