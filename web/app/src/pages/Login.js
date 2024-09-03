import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { useNavigate } from "react-router-dom";
import "../style/ResponsiveLogin.css"
function Login() {
    const [phone, setPhone] = useState('');
    const [pass, setPass] = useState('');

    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const payload = {
                phone: phone,
                pass: pass
            }
            await axios.post(config.api_path + '/member/signin', payload).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'Sign In',
                        text: 'เข้าสู่ระบบแล้ว',
                        icon: 'success',
                        timer: 2000
                    })

                    localStorage.setItem(config.token_name, res.data.token);

                    navigate('/home');
                } else {
                    Swal.fire({
                        title: 'Sign In',
                        text: 'ไม่พบข้อมูลในระบบ',
                        icon: 'warning',
                        timer: 2000
                    })
                }
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            Swal.fire({
                title: 'Error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    return (
        <>
            <div className="fullscreen-container">
                <div className="left-side d-flex flex-column justify-content-center bg-white p-5">
                    <div className="text-center mb-4">
                        <h2 className="font-weight-bold mb-3">Login</h2>
                        <p>POS on Cloud</p>
                    </div>
                    <div className="form-group">
                        <input onChange={e => setPhone(e.target.value)} className="form-control" placeholder="Phone" />
                    </div>
                    <div className="form-group mt-3">
                        <input onChange={e => setPass(e.target.value)} type="password" className="form-control" placeholder="Password" />
                    </div>
                    <div className="text-center mt-4">
                        <button onClick={handleSignIn} className="btn btn-primary btn-block">
                            Login
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Login;
