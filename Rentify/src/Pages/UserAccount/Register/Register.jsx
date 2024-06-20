import "./Register.css";
import Logo from "/Note-app-icon.jpeg";
import HeroImage from "/UserAccountHeroImage.svg";
import { Link } from "react-router-dom";
import { serverBase } from "../../../Configs/Server";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useState } from "react";

const emailRegex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/);
const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/);


export default function Register() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const fields = [{ Email: email }, { Username: userName }, { Password: password }];

    async function register(e) {
        e.preventDefault();
        fields.forEach(field => {
            const key = Object.keys(field)[0];
            if (field[key] == '') {
                toast.error(`${key} Required`);
            }
        });

        if (!emailRegex.test(email)) {
            toast.error("Invalid email")
            return;
        }
        else if (!passwordRegex.test(password)) {
            toast.error("Password must be atleast 8 character long and must contain atleast 1 uppercase alphabet character, 1 lowercase alphabet character, 1 numeric character and 1 special character.")
            return;
        }

        try {
            const result = await fetch(`${serverBase}/useraccount/register`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: userName,
                    email: email,
                    password: password
                })
            })
            if (result.ok) {
                navigate("/");
            }
        } catch (error) {
            console.log(error)
            navigate("/useraccounts/register");
        }
    }

    return (
        <div className="useraccount register">
            <header>
                <nav className="useraccount register-nav">
                    <div className="useraccount register-nav-logo">
                        <Link to="/">
                            <img src={Logo} alt={".Notes"} />
                        </Link>
                    </div>
                    <div className="useraccount register-nav-link">
                        <Link to="/useraccounts/login">Login</Link>
                    </div>
                </nav>
            </header>
            <main>
                <div className="useraccount account-element">
                    <div className="useraccount form">
                        <div className="useraccount form-message">
                            <h1>
                                Register Now
                            </h1>
                            <p>Hi, Create your new account 👋 </p>
                        </div>
                        <form>
                            <div >
                                <label htmlFor="Username"  >Username</label>
                                <input type="text" id="Username" name="Username" placeholder="Enter your username" value={userName} onChange={(e) => {
                                    setUserName(e.target.value);
                                }} />
                            </div>

                            <div>
                                <label htmlFor="Email" >Email</label>
                                <input type="text" id="Email" name="Email" placeholder="Enter your email" value={email} onChange={(e) => {
                                    setEmail(e.target.value);
                                }} />
                            </div>
                            <div>
                                <label htmlFor="Password" >Password</label>
                                <input type="password" id="Password" name="Password" placeholder="Enter your password" value={password} onChange={(e) => {
                                    setPassword(e.target.value);
                                }} />
                            </div>
                            <div className="useraccount rememberMe">
                                <div>
                                    <input type="checkbox" id="RememberMeChoice" name="rememberMeChoice" />
                                    <label htmlFor="RememberMeChoice">Remember me</label>
                                </div>
                            </div>
                            <div className="useraccount submit">
                                <input className="useraccount form-submit" type="submit" value={"Register"} onClick={(e) => {
                                    register(e);
                                }} />
                                <p className="useraccount no-account">
                                    Already have an account? <Link to="/useraccounts/login">Login</Link>
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
    );
}
