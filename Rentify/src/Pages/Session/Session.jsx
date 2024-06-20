import { useContext, useEffect, useState } from 'react'
import { useNavigate, Link, Outlet, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverBase } from '../../Configs/Server';
import './Session.css'

export default function Session() {

    const [pageNumber, setPageNumber] = useState(1);
    const [pages, setPages] = useState([{}])
    const navigate = useNavigate();

    const sessionId = sessionStorage.getItem('session-id-notes-app');
    const token = localStorage.getItem('jwt-notes-app');

    useEffect(() => {
        if (sessionId == null) {
            navigate('/');
        }
        if (token)
            getSession();
        else
            toast.error('Invalid token')
    });

    async function getSession() {
        try {
            const result = await fetch(`${serverBase}/session/getsession/${sessionId}`, {
                method: 'get',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });
            const resultBody = await result.json();
            if (result.ok) {
            }
            else {
                toast.error(resultBody.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }


    function panelControl(e) {
        const panel = e.target.closest('.Session.panel');
        panel.classList.toggle("hidden")
        e.target.closest('.Session.panel button').classList.toggle("rotate");
    }

    return (
        <div className='Session wrapper'>
            <div className='Session console'>
                <div className="Session panel left-panel">
                    <button onClick={panelControl}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-bar-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5" />
                    </svg></button>
                </div>
                <div className="Session board">
                    <Outlet />
                </div>
                <div className="Session panel right-panel">
                    <button onClick={panelControl}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-bar-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div >
    )
}