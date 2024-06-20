import "./Layout.css";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
    return (
        <div className="user-account-layout">
            <Outlet />
            <ToastContainer />
        </div>
    )
}