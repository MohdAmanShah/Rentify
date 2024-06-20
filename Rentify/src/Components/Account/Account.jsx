import "./Account.css"
import { serverBase } from '../../Configs/Server.js';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Account() {
    const navigate = useNavigate();
    async function Logout() {

        const jwtToken = localStorage.getItem("jwt-notes-app");
        try {
            const result = await fetch(`${serverBase}/useraccount/logout`, {
                method: "post",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
            if (result.ok) {
                localStorage.removeItem("jwt-notes-app");
                navigate("/useraccounts/login");
            }
            else {
                toast.error("Couldn't log out.");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }


    return (
        <div style={{ lineHeight: "0px" }}>
            <div className='Accounts Icon' onClick={(e) => {
                e.target.closest(".Accounts.Icon").classList.toggle('active');
            }}>
                <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11 6C11 7.65685 9.65685 9 8 9C6.34315 9 5 7.65685 5 6C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6Z"
                        fill="currentColor" />
                    <path
                        d="M2 0C0.895431 0 0 0.895431 0 2V14C0 15.1046 0.895431 16 2 16H14C15.1046 16 16 15.1046 16 14V2C16 0.895431 15.1046 0 14 0H2ZM14 1C14.5523 1 15 1.44772 15 2V14C15 14.5523 14.5523 15 14 15V14C14 13 13 10 8 10C3 10 2 13 2 14V15C1.44772 15 1 14.5523 1 14V2C1 1.44772 1.44772 1 2 1H14Z"
                        fill="currentColor" />
                </svg>
                <div className="Accounts Menu">
                    <ul>
                        <li>
                            <Link to="/userprofile">
                                Profile
                            </Link>
                        </li>
                        <li className="Accounts logout-button">
                            <button onClick={() => {
                                Logout();
                            }} >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    )
}