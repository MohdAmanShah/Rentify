import "./Login.css";
import Logo from "/Note-app-icon.jpeg";
import HeroImage from "/UserAccountHeroImage.svg";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { serverBase } from "../../../Configs/Server";
import { useNavigate } from "react-router-dom";


const emailRegex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/);
export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function login(e) {
        e.preventDefault();
        const fields = [
            { email: email },
            { password: password }
        ];
        for (let i = 0; i < fields.length; ++i) {
            const field = fields[i];
            const key = Object.keys(field)[0];
            if (field[key] == '') {
                toast.error(`${key} Required`);
                return;
            }
        }

        if (!emailRegex.test(email)) {
            toast.error("Invalid email")
            return;
        }
        try {
            const result = await fetch(`${serverBase}/useraccount/login`, {
                method: 'post',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            if (result.ok) {
                const resultBody = await result.json();
                localStorage.setItem("jwt-notes-app", resultBody.jwt);
                navigate("/");
            }
            else {
                const resultBody = await result.json();
                toast.error(resultBody.message);
            }
        }
        catch (error) {
            toast.error(error.message);
            navigate("/useraccounts/login");
        }
    }

    return (
        <div className="useraccount login">
            <header>
                <nav className="useraccount login-nav">
                    <div className="useraccount login-nav-logo">
                        <Link to="/">
                            <img src={Logo} alt={".Notes"} />
                        </Link>
                    </div>
                    <div className="useraccount login-nav-link">
                        <Link to="/useraccounts/register">Register</Link>
                    </div>
                </nav>
            </header>
            <main>
                <div className="useraccount account-element">
                    <div className="useraccount form">
                        <div className="useraccount form-message">
                            <h1>
                                Login Now
                            </h1>
                            <p>Hi, Welcome back 👋 </p>
                        </div>
                        <form>
                            <div className="placeholder">
                                <label >Email</label>
                                <input defaultValue="" type="text" placeholder="Enter your email" />
                            </div>

                            <div>
                                <label htmlFor="Email" >Email</label>
                                <input type="text" id="Email" name="Email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="Password" >Password</label>
                                <input type="password" id="Password" name="Password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className="useraccount rememberMe">
                                <div>
                                    <input type="checkbox" id="RememberMeChoice" name="rememberMeChoice" />
                                    <label htmlFor="RememberMeChoice">Remember me</label>
                                </div>
                                <Link to="#">Forgot Password?</Link>
                            </div>


                            <div className="useraccount submit">
                                <input className="useraccount form-submit" type="submit" value={"Login"} onClick={(e) => { login(e); }} />
                                <p className="useraccount no-account">
                                    Not registered yet? <span>Create an account</span> <Link to="/useraccounts/register">Register</Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="useraccount-image">
                        <img src={HeroImage} alt={"Hero Image"} />
                    </div>
                </div>
            </main>
        </div>
    )
}