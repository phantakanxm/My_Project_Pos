import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";

function Product() {
    const [product, setProduct] = useState({});
    const [products, setProducts] = useState([]);
    const [productImage, setProductImage] = useState({});
    const [productImages, setProductImages] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/product/list', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setProducts(res.data.results);
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

    const clearForm = () => {
        setProduct({
            name: '',
            detail: '',
            price: '',
            cost: '',
            barcode: ''
        });
    }

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            let url = config.api_path + '/product/insert';

            if (product.id !== undefined) {
                url = config.api_path + '/product/update';
            }

            await axios.post(url, product, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'บันทึกข้อมูล',
                        text: 'บันทึกข้อมูลสินค้าแล้ว',
                        icon: 'success',
                        timer: 2000
                    })

                    fetchData();
                    handleClose();
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

    const handleClose = () => {
        const btns = document.getElementsByClassName('btnClose');
        for (let i = 0; i < btns.length; i++) {
            btns[i].click();
        }
    }

    const handleDelete = (item) => {
        Swal.fire({
            title: 'ลบข้อมูล',
            text: 'ยืนยันการลบข้อมูลออกจากระบบ',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    await axios.delete(config.api_path + '/product/delete/' + item.id, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            fetchData();
                            Swal.fire({
                                title: 'ลบข้อมูล',
                                text: 'ลบข้อมูลแล้ว',
                                icon: 'success',
                                timer: 2000
                            })
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
        })
    }

    const handleChangeFile = (files) => {
        setProductImage(files[0]);
    }

    const handleUpload = () => {
        Swal.fire({
            title: 'ยืนยันการอัพโหลดภาพสินค้า',
            text: 'โปรดทำการยืนยัน เพื่ออัพโหลดภาพสินค้านี้',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    const _config = {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem(config.token_name),
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    const formData = new FormData();
                    formData.append('productImage', productImage);
                    formData.append('proudctImageName', productImage.name);
                    formData.append("productId", product.id);

                    await axios.post(config.api_path + '/productImage/insert', formData, _config).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'upload ภาพสินค้า',
                                text: 'upload ภาพสินค้าเรียบร้อยแล้ว',
                                icon: 'success',
                                timer: 2000
                            })

                            fetchDataProductImage({id: product.id});
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
        })
    }

    const fetchDataProductImage = async (item) => {
        try {
            await axios.get(config.api_path + '/productImage/list/' + item.id, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setProductImages(res.data.results);
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

    const handleChooseProduct = (item) => {
        setProduct(item);
        fetchDataProductImage(item)
    }

    const handleChooseMainImage = (item) => {
        Swal.fire({
            title: 'เลือกภาพหลัก',
            text: 'ยืนยันเลือกภาพนี้ เป็นภาพหลักของสินค้า',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            try {
                const url = config.api_path + '/productImage/chooseMainImage/' + item.id + '/' + item.productId;

                await axios.get(url, config.headers()).then(res => {
                    if (res.data.message === 'success') {
                        fetchDataProductImage({
                            id: item.productId
                        });

                        Swal.fire({
                            title: 'เลือกภาพหลัก',
                            text: 'บันทึกการเลือกภาพหลักของสินค้าแล้ว',
                            icon: 'success',
                            timer: 2000
                        })
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
        })
    }

    const handleDeleteProductImage = (item) => {
        try {
            Swal.fire({
                title: 'ลบภาพสินค้า',
                text: 'ยืนยันการลบภาพสินค้าออกจากระบบ',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            }).then(async res => {
                if (res.isConfirmed) {
                    await axios.delete(config.api_path + '/productImage/delete/' + item.id, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            fetchDataProductImage({id: item.productId});

                            Swal.fire({
                                title: 'ลบภาพสินค้า',
                                text: 'ลบภาพสินค้าออกจากระบบแล้ว',
                                icon: 'success',
                                timer: 2000
                            })
                        }
                    }).catch(err => {
                        throw err.response.data;
                    })
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
                        <div className="card-title">สินค้า</div>
                    </div>
                    <div className="card-body">
                        <button onClick={clearForm} data-toggle='modal' data-target='#modalProduct' className="btn btn-primary">
                            <i className="fa fa-plus mr-2"></i>
                            เพิ่มรายการ
                        </button>

                        <table className="mt-3 table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>barcode</th>
                                    <th>ชื่อสินค้า</th>
                                    <th className="text-right">ราคาทุน</th>
                                    <th className="text-right">ราคาจำหน่าย</th>
                                    <th>รายละเอียด</th>
                                    <th width='170px'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? products.map(item =>
                                    <tr>
                                        <td>{item.barcode}</td>
                                        <td>{item.name}</td>
                                        <td className="text-right">{parseInt(item.cost).toLocaleString('th-TH')}</td>
                                        <td className='text-right'>{parseInt(item.price).toLocaleString('th-TH')}</td>
                                        <td>{item.detail}</td>
                                        <td className="text-center">
                                            <button
                                                onClick={e => handleChooseProduct(item)}
                                                data-toggle='modal'
                                                data-target='#modalProductImage'
                                                className="btn btn-primary mr-2">
                                                <i className="fa fa-image"></i>
                                            </button>
                                            <button onClick={e => setProduct(item)}
                                                data-toggle='modal'
                                                data-target='#modalProduct'
                                                className="btn btn-info mr-2">
                                                <i className="fa fa-pencil"></i>
                                            </button>
                                            <button onClick={e => handleDelete(item)} className="btn btn-danger">
                                                <i className="fa fa-times"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id='modalProduct' title='สินค้า' modalSize='modal-lg'>
                <form onSubmit={handleSave}>
                    <div className="row">
                        <div className="mt-3 col-2">
                            <label>barcode</label>
                            <input value={product.barcode}
                                onChange={e => setProduct({ ...product, barcode: e.target.value })}
                                className="form-control" />
                        </div>

                        <div className="mt-3 col-10">
                            <label>ชื่อสินค้า</label>
                            <input value={product.name}
                                onChange={e => setProduct({ ...product, name: e.target.value })}
                                className="form-control" />
                        </div>

                        <div className="mt-3 col-2">
                            <label>ราคาจำหน่าย</label>
                            <input value={product.price}
                                onChange={e => setProduct({ ...product, price: e.target.value })}
                                className="form-control" />
                        </div>

                        <div className="mt-3 col-2">
                            <label>ราคาทุน</label>
                            <input value={product.cost}
                                onChange={e => setProduct({ ...product, cost: e.target.value })}
                                className="form-control" />
                        </div>

                        <div className="mt-3 col-8">
                            <label>รายละเอียด</label>
                            <input value={product.detail}
                                onChange={e => setProduct({ ...product, detail: e.target.value })}
                                className="form-control" />
                        </div>
                    </div>

                    <div className="mt-3">
                        <button onClick={handleSave} className="btn btn-primary">
                            <i className="fa fa-check mr-2"></i>
                            Save
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal id='modalProductImage' title='ภาพสินค้า' modalSize='modal-lg'>
                <div className="row">
                    <div className="col-4">
                        <div>barcode</div>
                        <input value={product.barcode} disabled className="form-control" />
                    </div>
                    <div className="col-8">
                        <div>ชื่อสินค้า</div>
                        <input value={product.name} disabled className="form-control" />
                    </div>
                    <div className="col-12 mt-3">
                        <div>รายละเอียด</div>
                        <input value={product.detail} disabled className="form-control" />
                    </div>
                    <div className="col-12 mt-3">
                        <div>เลือกภาพสินค้า</div>
                        <input onChange={e => handleChangeFile(e.target.files)} type='file' name='imageName' className="form-control" />
                    </div>
                </div>

                <div className="mt-3">
                    {productImage.name !== undefined ?
                        <button onClick={handleUpload} className="btn btn-primary">
                            <i className="fa fa-check mr-2"></i>
                            Upload and Save
                        </button>
                        : ''}
                </div>

                <div className='mt-3'>ภาพสินค้า</div>
                <div className='row mt-2'>
                    {productImages.length > 0 ? productImages.map(item =>
                        <div className='col-3' key={item.id}>
                            <div className='card'>
                                <img className='card-img-top'
                                    src={config.api_path + '/uploads/' + item.imageName}
                                    width='100%' alt='' />
                                <div className='card-body text-center'>
                                    {item.isMain ?
                                        <button className='btn btn-info mr-2'>
                                            ภาพหลัก
                                        </button>
                                        :
                                        <button onClick={e => handleChooseMainImage(item)}
                                            className='btn btn-default mr-2'>
                                            ภาพหลัก
                                        </button>
                                    }

                                    <button onClick={e => handleDeleteProductImage(item)} className="btn btn-danger">
                                        <i className="fa fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : ''}
                </div>
            </Modal>
        </>
    )
}

export default Product;