import { useEffect, useState } from "react";
import Template from "../components/Template";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import Modal from "../components/Modal";
import * as dayjs from 'dayjs';

function ReportStock() {
    const [stocks, setStocks] = useState([]);
    const [currentStock, setCurrentStock] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/stock/report', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setStocks(res.data.results);
                }
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
                        <div className="card-title">รายงาน Stock</div>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>barcode</th>
                                    <th>รายการ</th>
                                    <th className="text-end">รับเข้า</th>
                                    <th className="text-end">ขายออก</th>
                                    <th className="text-end">คงเหลือ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stocks.length > 0 ? stocks.map(item =>
                                    <tr>
                                        <td>{item.result.barcode}</td>
                                        <td>{item.result.name}</td>
                                        <td className="text-end">
                                            <a onClick={e => setCurrentStock(item)}
                                                data-toggle="modal"
                                                data-target="#modalStockIn"
                                                className="btn btn-link text-success">
                                                {item.stockIn.toLocaleString('th-TH')}
                                            </a>
                                        </td>
                                        <td className="text-end">
                                            <a onClick={e => setCurrentStock(item)}
                                                data-toggle="modal"
                                                data-target="#modalStockOut"
                                                className="btn btn-link text-danger">
                                                {item.stockOut.toLocaleString('th-TH')}
                                            </a>
                                        </td>
                                        <td className="text-end">
                                            {(item.stockIn - item.stockOut).toLocaleString('th-TH')}
                                        </td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id="modalStockIn" title="ข้อมูลการรับเข้าสต้อก" modalSize="modal-lg">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th width="120px">barcode</th>
                            <th>รายการ</th>
                            <th width="100px" className="text-end">จำนวน</th>
                            <th width="150px" className="text-center">วันที่</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStock.result != undefined ? currentStock.result.stocks.map(item =>
                            <tr>
                                <td>{item.product.barcode}</td>
                                <td>{item.product.name}</td>
                                <td className="text-end">{item.qty}</td>
                                <td className="text-center">
                                    {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                                </td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>

            <Modal id="modalStockOut" title="ข้อมูลการขาย" modalSize="modal-lg">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th width="120px">barcode</th>
                            <th>รายการ</th>
                            <th width="100px" className="text-end">จำนวน</th>
                            <th width="150px" className="text-center">วันที่</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStock.result != undefined ? currentStock.result.billSaleDetails.map(item =>
                            <tr>
                                <td>{item.product.barcode}</td>
                                <td>{item.product.name}</td>
                                <td className="text-end">{item.qty}</td>
                                <td className="text-center">
                                    {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                                </td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>
        </>
    )
}

export default ReportStock;