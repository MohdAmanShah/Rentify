import ReactDOM from 'react-dom/client'
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom'
import MainLayout from './Components/MainLayout/Layout'
import Home from './Pages/Home/Home'
import Login from "./Pages/UserAccount/Login/Login"
import Register from "./Pages/UserAccount/Register/Register"
import ErrorPage from './Pages/ErrorPage/ErrorPage'
import UserAccountLayout from './Components/UserAccountLayout/Layout'
import LoginContext from './Context/LoginContext';
import ProfileLayout from './Components/ProfileLayout/ProfileLayout';
import UserFriends from './Pages/UserProfile/Friends/UserFriends';
import UserProfile from './Pages/UserProfile/Profile/UserProfile';
import UserSessions from './Pages/UserProfile/Sessions/UserSessions';
import ChangePassword from './Pages/UserProfile/ChangePasswordModal/ChangePassword';
import Session from './Pages/Session/Session';
import Page from './Pages/Session/Page/Page';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/session/:name',
                element: <Session />,
                children: [
                    {
                        path: ':pagenumber',
                        element: <Page />
                    }
                ]
            }
        ]
    },
    {
        path: '/useraccounts',
        element: <UserAccountLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'login',
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            }
        ]
    },
    {
        path: '/userprofile',
        element: <ProfileLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <UserProfile />
            },
            {
                path: "sessions",
                element: <UserSessions />
            },
            {
                path: "friends",
                element: <UserFriends />
            },
            {
                path: 'changepassword',
                element: <ChangePassword />
            }
        ]
    }

])


function createLoginContext() {
    let LoginStatus = false;
    function setLoginStatus(status) {
        LoginStatus = status;
    }
    function getLoginStatus() {
        return LoginStatus;
    }
    return { getLoginStatus, setLoginStatus };
}


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <LoginContext.Provider value={createLoginContext()}>
            <RouterProvider router={router} />
        </LoginContext.Provider>
    </React.StrictMode>
)
