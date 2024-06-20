import Navbar from "../Navbar/Navbar"
import SideNavBar from "../SideNavBar/Sidenavbar"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import './ProfileLayout.css'
export default function ProfileLayout() {
    return (
        <>
            <div className="Profile layout">
                <Navbar />
                <div className="Profile sidebar-layout container">
                    <SideNavBar />
                    <div className="content">
                        <Outlet />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>

    )
}