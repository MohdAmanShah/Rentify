import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import NoteSession from "./Components/NoteSession/NoteSession"
import NewNoteButton from "./Components/NewNoteButton/NewNoteButton"
import SessionContext from '../../Context/SessionContext.js'
import Loading from "../../Components/Loading/Loading.jsx";

import "./Home.css"
import { serverBase } from "../../Configs/Server.js";
import Session from "../Session/Session.jsx";

export default function Home() {
    const [Sessions, setSession] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("jwt-notes-app");
        if (!token) {
            navigate("/useraccounts/login");
            return;
        }
        getAllSessions(token).then(e => {
            setSession(e);
        });
    }, []);

    async function getAllSessions(token) {
        if (token) {
            try {
                const result = await fetch(`${serverBase}/session/getusersessions`, {
                    method: 'get',
                    headers: {
                        'content-type': 'application/json',
                        'authorization': `Bearer ${token}`
                    }
                });
                const resultBody = await result.json();
                const newArray = resultBody.session.map(({ id, title, description, ownerId }) => ({
                    id,
                    title,
                    desp: description,
                    owned: (ownerId == resultBody.id)
                }));
                return newArray;
            } catch (err) {
                console.log(err);
            }
        }
    }

    if (Sessions) {
        return (
            <SessionContext.Provider value={{ Sessions, setSession }}>
                <div className="container">
                    <div className="grid Home text-center">
                        {Sessions ? Sessions.map((session, index) => {
                            return (<NoteSession session={session} index={index} key={index} />);
                        }) : ''}
                    </div>
                    <div className="Home add-new-note-button">
                        <NewNoteButton />
                    </div>
                </div >
            </SessionContext.Provider>
        )
    }
    else {
        return (
            <div className="container loading-animation">
                <Loading />
            </div>
        )
    }
}