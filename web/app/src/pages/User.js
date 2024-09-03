import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";

function User() {
    const [user, setUser] = useState({});
    const [users, setUsers] = useState([]);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/user/list', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setUsers(res.data.results);
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

    const handleSave = async () => {
        try {
            let url = '/user/insert';

            if (user.id !== undefined) {
                url = '/user/edit';
            }

            await axios.post(config.api_path + url, user, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'บันทึกข้อมูล',
                        text: 'บันทึกข้อมูลเข้าระบบแล้ว',
                        icon: 'success',
                        timer: 2000
                    })

                    handleClose();
                    fetchData();
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

    const handleClose = () => {
        const btns = document.getElementsByClassName('btnClose');
        for (let i = 0; i < btns.length; i++) {
            btns[i].click();
        }
    }

    const clearForm = () => {
        setUser({
            id: undefined,
            name: '',
            usr: '',
            level: 'user'
        });
        setPassword('');
        setPasswordConfirm('');
    }

    const changePassword = (item) => {
        setPassword(item);
        comparePassword();
    }

    const changePasswordConfirm = (item) => {
        setPasswordConfirm(item);
        comparePassword();
    }

    const comparePassword = () => {
        if (password.length > 0 && passwordConfirm.length > 0) {
            if (password != passwordConfirm) {
                Swal.fire({
                    title: 'ตรวจสอบการกรอกรหัสผ่าน',
                    text: 'โปรดกรอกรหัสผ่าน ให้ตรงกัน',
                    icon: 'error'
                });
            } else {
                setUser({
                    ...user,
                    pwd: password
                })
            }
        }
    }

    const handleDelete = (item) => {
        try {
            Swal.fire({
                title: 'ยืนยันการลบข้อมูล',
                text: 'คุณต้องการลบข้อมูล ผู้ใช้งานใช่หรือไม่',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            }).then(async res => {
                if (res.isConfirmed) {
                    await axios.delete(config.api_path + '/user/delete/' + item.id, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'ลบข้อมูลแล้ว',
                                text: 'ระบบได้ทำการลบข้อมูลเรียบร้อยแล้ว',
                                icon: 'success',
                                timer: 2000
                            })

                            fetchData();
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
                        <div className="card-title">ผู้ใช้งานระบบ</div>
                    </div>
                    <div className="card-body">
                        <button onClick={clearForm} data-toggle="modal" data-target="#modalUser" className="btn btn-primary">
                            <i className="fa fa-plus me-2"></i>
                            เพิ่มรายการ
                        </button>

                        <table className="mt-3 table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>ชื่อ</th>
                                    <th>user</th>
                                    <th>ระดับ</th>
                                    <th width="150px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map(item =>
                                    <tr>
                                        <td>{item.name}</td>
                                        <td>{item.usr}</td>
                                        <td>{item.level}</td>
                                        <td className="text-center">
                                            <button onClick={e => setUser(item)}
                                                data-toggle="modal"
                                                data-target="#modalUser"
                                                className="btn btn-info me-2">
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

            <Modal id="modalUser" title="ผู้ใช้งานระบบ" modalSize="modal-lg">
                <div>
                    <label>ชื่อ</label>
                    <input value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} className="form-control" />
                </div>
                <div className="mt-3">
                    <label>username</label>
                    <input value={user.usr} onChange={e => setUser({ ...user, usr: e.target.value })} className="form-control" />
                </div>
                <div className="mt-3">
                    <label>password</label>
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onBlur={e => changePassword(e.target.value)}
                        type="password"
                        className="form-control" />
                </div>
                <div className="mt-3">
                    <label>ยืนยัน password</label>
                    <input
                        value={passwordConfirm}
                        onChange={e => setPasswordConfirm(e.target.value)}
                        onBlur={e => changePasswordConfirm(e.target.value)}
                        type="password"
                        className="form-control" />
                </div>
                <div className="mt-3">
                    <label>ระดับ</label>
                    <select value={user.level} onChange={e => setUser({ ...user, level: e.target.value })} className="form-control">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="mt-3">
                    <button onClick={handleSave} className="btn btn-primary">
                        <i className="fa fa-check me-2"></i>
                        Save
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default User;