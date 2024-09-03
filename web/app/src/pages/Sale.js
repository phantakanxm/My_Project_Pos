import { useEffect, useRef, useState } from "react";
import Template from "../components/Template";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import Modal from "../components/Modal";
import * as dayjs from "dayjs";
import PrintJS from "print-js";

function Sale() {
  const [products, setProducts] = useState([]);
  const [billSale, setBillSale] = useState({});
  const [currentBill, setCurrentBill] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [item, setItem] = useState({});
  const [inputMoney, setInputMoney] = useState(0);
  const [lastBill, setLastBill] = useState({});
  const [billToday, setBillToday] = useState([]);
  const [selectedBill, setSelectedBill] = useState({});
  const [memberInfo, setMemberInfo] = useState({});
  const [sumTotal, setSumTotal] = useState(0);

  const saleRef = useRef();

  useEffect(() => {
    fetchData();
    openBill();
    fetchBillSaleDetail();

    if (
      memberInfo.name !== undefined &&
      lastBill != {} &&
      lastBill.billSaleDetails !== undefined
    ) {
      let slip = document.getElementById("slip");
      slip.style.display = "block";

      PrintJS({
        printable: "slip",
        maxWidth: 250,
        type: "html",
      });

      slip.style.display = "none";
    }
  }, [memberInfo, lastBill]);

  const fetchBillSaleDetail = async () => {
    try {
      await axios
        .get(config.api_path + "/billSale/currentBillInfo", config.headers())
        .then((res) => {
          if (res.data.results !== null) {
            setCurrentBill(res.data.results);
            sumTotalPrice(res.data.results.billSaleDetails);
          }
        });
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.meesage,
        icon: "error",
      });
    }
  };

  const sumTotalPrice = (billSaleDetails) => {
    let sum = 0;

    for (let i = 0; i < billSaleDetails.length; i++) {
      const item = billSaleDetails[i];
      const qty = parseInt(item.qty);
      const price = parseInt(item.price);

      sum += qty * price;
    }

    setTotalPrice(sum);
  };

  const openBill = async () => {
    try {
      await axios
        .get(config.api_path + "/billSale/openBill", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setBillSale(res.data.result);
          }
        });
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.meesage,
        icon: "error",
      });
    }
  };

  const fetchData = async () => {
    try {
      await axios
        .get(config.api_path + "/product/listForSale", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setProducts(res.data.results);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.meesage,
        icon: "error",
      });
    }
  };

  const handleSave = async (item) => {
    try {
      await axios
        .post(config.api_path + "/billSale/sale", item, config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            fetchBillSaleDetail();
          }
        });
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.meesage,
        icon: "error",
      });
    }
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบรายการนี้ใช่หรือไม่",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios
          .delete(
            config.api_path + "/billSale/deleteItem/" + item.id,
            config.headers()
          )
          .then((res) => {
            if (res.data.message === "success") {
              fetchBillSaleDetail();
            }
          });
      }
    });
  };

  const handleUpdateQty = async () => {
    try {
      axios
        .post(config.api_path + "/billSale/updateQty", item, config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            let btns = document.getElementsByClassName("btnClose");

            for (let i = 0; i < btns.length; i++) btns[i].click();

            fetchBillSaleDetail();
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.meesage,
        icon: "error",
      });
    }
  };

  const handleEndSale = () => {
    Swal.fire({
      title: "จบการขาย",
      text: "ยืนยันจบการขาย",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios
            .get(config.api_path + "/billSale/endSale", config.headers())
            .then((res) => {
              if (res.data.message === "success") {
                Swal.fire({
                  title: "จบการขาย",
                  text: "จบการขายสำเร็จแล้ว",
                  icon: "success",
                  timer: 1000,
                });

                setCurrentBill({});
                openBill();
                fetchBillSaleDetail();

                let btns = document.getElementsByClassName("btnClose");
                for (let i = 0; i < btns.length; i++) btns[i].click();

                //
                // load new total bill
                //
                if (saleRef.current) {
                  saleRef.current.refreshCountBill();
                }
              }
            })
            .catch((err) => {
              throw err.response.data;
            });
        } catch (e) {
          Swal.fire({
            title: "error",
            text: e.meesage,
            icon: "error",
          });
        }
      }
    });
  };

  const handleLastBill = async () => {
    try {
      await axios
        .get(config.api_path + "/billSale/lastBill", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setLastBill(res.data.result[0]);

            setSumTotal(0);

            let sum = 0;

            for (
              let i = 0;
              i < res.data.result[0].billSaleDetails.length;
              i++
            ) {
              const item = res.data.result[0].billSaleDetails[i];
              sum += parseInt(item.qty) * parseInt(item.price);
            }

            setSumTotal(sum);
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

  const handleBillToday = async () => {
    try {
      await axios
        .get(config.api_path + "/billSale/billToday", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setBillToday(res.data.results);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.meesage,
        icon: "error",
      });
    }
  };

  const handlePrint = async () => {
    try {
      await axios
        .get(config.api_path + "/member/info", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setMemberInfo(res.data.result);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });

      handleLastBill();
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
      <Template ref={saleRef}>
        <div className="card">
          <div className="card-header">
            <div className="">
              <div className="float-start">ขายสินค้า</div>
              <div className="float-end">
                <button
                  data-toggle="modal"
                  data-target="#modalEndSale"
                  className="btn btn-success me-2"
                >
                  <i className="fa fa-check me-2"></i>จบการขาย
                </button>
                <button
                  onClick={handleBillToday}
                  data-toggle="modal"
                  data-target="#modalBillToday"
                  className="btn btn-info me-2"
                >
                  <i className="fa fa-file me-2"></i>บิลวันนี้
                </button>
                <button
                  onClick={handleLastBill}
                  data-toggle="modal"
                  data-target="#modalLastBill"
                  className="btn btn-secondary"
                >
                  <i className="fa fa-file-alt me-2"></i>บิลล่าสุด
                </button>
                <button onClick={handlePrint} className="btn btn-primary ms-2">
                  <i className="fa fa-print me-2"></i>
                  พิมพ์บิลล่าสุด
                </button>
              </div>
              <div className="float-none"></div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-9">
                <div className="row">
                  {products.length > 0
                    ? products.map((item) => (
                      <div
                        className="col-3"
                        onClick={(e) => handleSave(item)}
                      >
                        <div className="card">
                          <img
                            className="card-img-top object-fit-cover"
                            width="100px"
                            height="100px"

                            src={
                              config.api_path +
                              "/uploads/" +
                              item.productImages[0].imageName
                            }
                          />
                          <div className="card-body text-center">
                            <div className="text-primary">{item.name}</div>
                            <div className="h3 mt-3">
                              {parseInt(item.price).toLocaleString("th-TH")}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                    : ""}
                </div>
              </div>
              <div className="col-3">
                <div className="">
                  <div
                    className="h1 ps-3 pe-3 text-end pt-3 pb-3"
                    style={{ color: "#70FE3F", backgroundColor: "black" }}
                  >
                    {totalPrice.toLocaleString("th-TH")}
                  </div>

                  {currentBill != {} &&
                    currentBill.billSaleDetails != undefined &&
                    currentBill.billSaleDetails.length > 0
                    ? currentBill.billSaleDetails.map((item) => (
                      <div className="card">
                        <div className="card-body">
                          <div>{item.product.name}</div>
                          <div>
                            <strong
                              className="text-danger me-3"
                              style={{ fontSize: "30px" }}
                            >
                              {item.qty}
                            </strong>
                            x
                            <span className="ms-2 me-2">
                              {parseInt(item.price).toLocaleString("th-TH")}
                            </span>
                            =
                            <span className="ms-2">
                              {(item.qty * item.price).toLocaleString(
                                "th-TH"
                              )}
                            </span>
                          </div>
                          <div className="text-center">
                            <button
                              onClick={(e) => setItem(item)}
                              data-toggle="modal"
                              data-target="#modalQty"
                              className="btn btn-primary me-2"
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              onClick={(e) => handleDelete(item)}
                              className="btn btn-danger"
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Template>

      <Modal id="modalQty" title="ปรับจำนวน">
        <div>
          <label>จำนวน</label>
          <input
            value={item.qty}
            onChange={(e) => setItem({ ...item, qty: e.target.value })}
            className="form-control"
          />

          <div className="mt-3">
            <button onClick={handleUpdateQty} className="btn btn-primary">
              <i className="fa fa-check me-2"></i>Save
            </button>
          </div>
        </div>
      </Modal>

      <Modal id="modalEndSale" title="จบการขาย">
        <div>
          <div>
            <label>ยอดเงินทั้งหมด</label>
          </div>
          <div>
            <input
              value={totalPrice.toLocaleString("th-TH")}
              disabled
              className="form-control text-end"
            />
          </div>
          <div className="mt-3">
            <label>รับเงิน</label>
          </div>
          <div>
            <input
              value={inputMoney}
              onChange={(e) => setInputMoney(e.target.value)}
              className="form-control text-end"
            />
          </div>
          <div className="mt-3">
            <label>เงินทอน</label>
          </div>
          <div>
            <input
              value={(inputMoney - totalPrice).toLocaleString("th-TH")}
              className="form-control text-end"
              disabled
            />
          </div>
          <div className="text-center mt-3">
            <button
              onClick={(e) => setInputMoney(totalPrice)}
              className="btn btn-primary me-2"
            >
              <i className="fa fa-check me-2"></i>
              จ่ายพอดี
            </button>
            <button onClick={handleEndSale} className="btn btn-success">
              <i className="fa fa-check me-2"></i>
              จบการขาย
            </button>
          </div>
        </div>
      </Modal>

      <Modal id="modalLastBill" title="บิลล่าสุด" modalSize="modal-lg">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>barcode</th>
              <th>รายการ</th>
              <th className="text-end">ราคา</th>
              <th className="text-end">จำนวน</th>
              <th className="text-end">ยอดรวม</th>
            </tr>
          </thead>
          <tbody>
            {lastBill.billSaleDetails != undefined
              ? lastBill.billSaleDetails.map((item) => (
                <tr>
                  <td>{item.product.barcode}</td>
                  <td>{item.product.name}</td>
                  <td className="text-end">{item.price}</td>
                  <td className="text-end">{item.qty}</td>
                  <td className="text-end">{item.price * item.qty}</td>
                </tr>
              ))
              : ""}
          </tbody>
        </table>
      </Modal>

      <Modal id="modalBillToday" title="บิลวันนี้" modalSize="modal-lg">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th width="140px"></th>
              <th>เลขบิล</th>
              <th>วัน เวลาที่ขาย</th>
            </tr>
          </thead>
          <tbody>
            {billToday.length > 0
              ? billToday.map((item) => (
                <tr>
                  <td className="text-center">
                    <button
                      onClick={(e) => setSelectedBill(item)}
                      data-toggle="modal"
                      data-target="#modalBillSaleDetail"
                      className="btn btn-primary"
                    >
                      <i className="fa fa-eye me-2"></i>
                      ดูรายการ
                    </button>
                  </td>
                  <td>{item.id}</td>
                  <td>{dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
              ))
              : ""}
          </tbody>
        </table>
      </Modal>

      <Modal
        id="modalBillSaleDetail"
        title="รายละเอียดในบิล"
        modalSize="modal-lg"
      >
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>barcode</th>
              <th>รายการ</th>
              <th className="text-end">ราคา</th>
              <th className="text-end">จำนวน</th>
              <th className="text-end">ยอดรวม</th>
            </tr>
          </thead>
          <tbody>
            {selectedBill != {} &&
              selectedBill.billSaleDetails != undefined &&
              selectedBill.billSaleDetails.length > 0
              ? selectedBill.billSaleDetails.map((item) => (
                <tr>
                  <td>{item.product.barcode}</td>
                  <td>{item.product.name}</td>
                  <td className="text-end">{item.price}</td>
                  <td className="text-end">{item.qty}</td>
                  <td className="text-end">{item.price * item.qty}</td>
                </tr>
              ))
              : ""}
          </tbody>
        </table>
      </Modal>

      <div id="slip">
        {memberInfo != {} ? (
          <>
            <div>เลขบิล : {lastBill.id}</div>
            <center>ใบเสร็จรับเงิน</center>
            <center>
              <strong>{memberInfo.name}</strong>
            </center>
            <hr />

            <table width="100%">
              <tbody>
                {lastBill != {} &&
                  lastBill.billSaleDetails != undefined &&
                  lastBill.billSaleDetails.length > 0
                  ? lastBill.billSaleDetails.map((item) => (
                    <>
                      <tr>
                        <td style={{ textAlign: "right" }}>
                          {item.product.name}
                        </td>
                        <td align="right">{item.qty}</td>
                        <td align="right">
                          {parseInt(item.price).toLocaleString("th-TH")}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {(item.qty * item.price).toLocaleString("th-TH")}
                        </td>
                      </tr>
                    </>
                  ))
                  : ""}
              </tbody>
            </table>
            <hr />

            <div>ยอดรวม : {sumTotal.toLocaleString("th-TH")} บาท</div>
            <div>
              เวลา : {dayjs(lastBill.createdAt).format("DD/MM/YYYY HH:mm")}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Sale;
