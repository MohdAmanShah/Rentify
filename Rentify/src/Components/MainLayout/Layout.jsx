import { Outlet } from "react-router-dom"
import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Layout() {



    return (
        <div>
            <header>
                <Navbar />
            </header>
            <main>
                <Outlet />
            </main>
            <ToastContainer />
        </div>
    )
}

