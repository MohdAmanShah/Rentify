import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./NoteSession.css"
import SessionContext from "../../../../Context/SessionContext";
import { serverBase } from "../../../../Configs/Server";
import { toast } from 'react-toastify';
import NoteForm from "../NoteForm/NoteForm";

export default function NoteSession({ session, index }) {

    return (
        <div className="card NoteSession" >

            <CardCloseKebab session={session} index={index} />
            <div className="card-body">
                <h5 className="card-title ">
                    <Link to={`session/${session.title.replace(/\s+/g, '')}/1`} onClick={() => {
                        sessionStorage.setItem('session-id-notes-app', session.id);
                    }
                    }>{session.title}</Link>
                    {session.owned ? <span className="owned"> [Owned]</span> : <span className="invited"> [Invited]</span>}
                </h5>
                <p className="card-text">{session.desp}</p>
            </div>
        </div>
    );
}



function CardCloseKebab({ session, index }) {
    const { Sessions, setSession } = useContext(SessionContext);
    const [isEditable, setEditableStatus] = useState(false);

    async function deleteSession() {
        const id = session.id
        const token = localStorage.getItem("jwt-notes-app");
        try {
            const result = await fetch(`${serverBase}/session/deletesession/${id}`, {
                method: 'delete',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const resultBody = await result.json();
            if (result.ok) {
                toast.success(resultBody.message);
            }

        } catch (err) {
            console.log(err);
        }
        let newItems = [...Sessions];
        newItems = [...newItems.slice(0, index), ...newItems.slice(index + 1)];
        setSession(newItems);
    }
    async function updateNote({ title, desp }) {
        const jwttoken = localStorage.getItem("jwt-notes-app");
        try {
            const result = await fetch(`${serverBase}/session/updatesession`, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwttoken}`
                },
                body: JSON.stringify({
                    id: session.id,
                    title: title,
                    description: desp,
                })
            });
            const resultBody = await result.json();
            if (result.ok) {
                const sessions = [...Sessions];
                sessions[index].title = title;
                sessions[index].desp = desp;
                setSession([...sessions]);
                toast.success(resultBody.message);
            }
            else {
                toast.error(resultBody.message);
            }
            setEditableStatus(false);
        }
        catch (error) {
            toast.error(error.message);
        }
    }




    const kebabController = (e) => {
        const kebab = e.target.closest('.NoteSession.kebab');
        const kebabs = document.querySelectorAll('.NoteSession.kebab');
        Array.from(kebabs).forEach((k) => {
            if (kebab !== k) {
                const middle = k.querySelector('.NoteSession.kebab-middle');
                const cross = k.querySelector('.NoteSession.kebab-cross');
                const dropdown = k.querySelector('.NoteSession.kebab-dropdown');
                middle.classList.remove('active');
                cross.classList.remove('active');
                dropdown.classList.remove('active');
            }
        })
        const middle = kebab.querySelector('.NoteSession.kebab-middle');
        const cross = kebab.querySelector('.NoteSession.kebab-cross');
        const dropdown = kebab.querySelector('.NoteSession.kebab-dropdown');
        middle.classList.toggle('active');
        cross.classList.toggle('active');
        dropdown.classList.toggle('active');
    }

    return (
        <div className="NoteSession options">
            {isEditable ? <NoteForm action={updateNote} callback={setEditableStatus} session={session} /> : ''}
            <div className="NoteSession kebab" onClick={kebabController}>
                <figure></figure>
                <figure className="NoteSession kebab-middle"></figure>
                <p className="NoteSession kebab-cross">x</p>
                <figure></figure>
                <ul className="NoteSession kebab-dropdown">
                    <li>
                        <button onClick={() => { setEditableStatus(true) }}>
                            Edit
                        </button>
                    </li>
                    <li className="remove-btn">
                        <button onClick={deleteSession} >Delete</button>
                    </li>
                </ul>
            </div>

        </div>
    )
}