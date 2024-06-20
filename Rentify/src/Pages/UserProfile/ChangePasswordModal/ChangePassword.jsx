import "./ChangePassword.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { serverBase } from "../../../Configs/Server";

const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/);
export default function ChangePassword() {
    const token = localStorage.getItem("jwt-notes-app");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newConfirmedPassword, setNewConfirmedPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true); // Added state variable for password matching

    const resetFields = () => {
        setCurrentPassword("");
        setNewPassword("");
        setNewConfirmedPassword("");
        setPasswordsMatch(true);
    };
    async function updatePassword() {
        const fields = [{ currentPassword: currentPassword }, { newPassword: newPassword }, { newConfirmedPassword: newConfirmedPassword }];
        console.log(fields);
        if (newPassword !== newConfirmedPassword) {
            toast.error("Password don't match");
            return;
        }
        if (!passwordRegex.test(newPassword)) {
            toast.error("Password must be atleast 8 character long and must contain atleast 1 uppercase alphabet character, 1 lowercase alphabet character, 1 numeric character and 1 special character.")
            return;
        }
        try {
            const result = await fetch(`${serverBase}/userprofile/changepassword`, {
                method: 'put',
                headers: {
                    "content-type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    newPassword: newPassword,
                    password: currentPassword
                })
            });
            const resultBody = await result.json();
            console.log(resultBody);
            if (result.ok)
                toast.success(resultBody.message);
            else
                toast.error(resultBody.message);

        }
        catch (err) {
            if (token == null) {
                toast.error("unauthorized");
                return;
            }
            toast.error(err.message);
        }
    }

    return (
        <div className="ChangePasswordModal wrapper">
            <div className="ChangePasswordModal background">
                <div className="ChangePasswordModal form">
                    <form>
                        <div className="form-floating mb-3 col-md-6">
                            <input type="password" className="form-control" id="floatingCurrentPassword" placeholder="Username" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                            <label htmlFor="floatingCurrentPassword">Current Password</label>
                        </div>
                        <div className="form-floating mb-3 col-md-6">
                            <input type="password" className="form-control" id="floatingNewPassword" placeholder="Username" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            <label htmlFor="floatingNewPassword">New Password</label>
                        </div>
                        <div className="form-floating mb-3 col-md-6">
                            <input type="password" className={`form-control ${!passwordsMatch ? 'confirm-pass' : ''}`} id="floatingNewConfirmedPassword" placeholder="Username" value={newConfirmedPassword} onChange={e => {
                                setNewConfirmedPassword(e.target.value);
                                if (e.target.value !== newPassword) {
                                    setPasswordsMatch(false);
                                } else {
                                    setPasswordsMatch(true);
                                }
                            }} />
                            <label htmlFor="floatingNewConfirmedPassword">Confirm New Password</label>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <input type="reset" className="w-100  btn btn-lg btn-secondary mb-3" value={"Reset"} onClick={() => {
                                    resetFields();
                                }} />
                            </div>
                            <div className="col-md-3">
                                <button type="submit" className="w-100  btn btn-lg btn-primary mb-3" onClick={e => { e.preventDefault(); updatePassword() }}>Save</button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <Link to="/userprofile">
                                <button type="button" className="w-100 btn btn-lg btn-dark mb-3">Back</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
