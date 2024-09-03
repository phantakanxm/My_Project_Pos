import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";

function BillSales() {
    const [billSales, setBillSales] = useState([]);
    const [selectBill, setSelectBill] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/billSale/list', config.headers()).then(res => {
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
            });
        }
    }

    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">รายงานบิลขาย</div>
                    </div>
                    <div className="card-body">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <td width="180px"></td>
                                <td width="100px">เลขบิล</td>
                                <td>วันที่</td>
                            </thead>
                            <tbody>
                                {billSales.length > 0 ? billSales.map(item =>
                                    <tr>
                                        <td className="text-center">
                                            <button data-toggle="modal"
                                                data-target="#modalBillSaleDetail"
                                                onClick={e => setSelectBill(item)}
                                                className="btn btn-primary">
                                                <i className="fa fa-file-alt me-2"></i>
                                                รายการบิลขาย
                                            </button>
                                        </td>
                                        <td>{item.id}</td>
                                        <td>{item.createdAt}</td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id="modalBillSaleDetail" title="รายการในบิล" modalSize="modal-lg">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>รายการ</th>
                            <th width="100px" className="text-end">ราคา</th>
                            <th width="100px" className="text-end">จำนวน</th>
                            <th width="100px" className="text-end">ยอดรวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectBill != {} && selectBill.billSaleDetails != null ?
                            selectBill.billSaleDetails.map(item =>
                                <tr>
                                    <td>{item.product.name}</td>
                                    <td className="text-end">{parseInt(item.price).toLocaleString('th-TH')}</td>
                                    <td className="text-end">{item.qty}</td>
                                    <td className="text-end">{(item.qty * item.price).toLocaleString('th-TH')}</td>
                                </tr>
                            ) : ''}
                    </tbody>
                </table>
            </Modal>
        </>
    )
}

export default BillSales;