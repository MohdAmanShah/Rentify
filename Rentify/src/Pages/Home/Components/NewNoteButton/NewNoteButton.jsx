import { useContext, useState } from "react";
import { toast } from "react-toastify";
import SessionContext from "../../../../Context/SessionContext";
import { serverBase } from "../../../../Configs/Server";
import "./NewNoteButton.css"

import NoteForm from "../NoteForm/NoteForm";

export default function NewNoteButton() {
    const [isFormOpen, setFormStatus] = useState(false);
    const { Sessions, setSession } = useContext(SessionContext);

    async function saveNote(data) {
        const jwttoken = localStorage.getItem("jwt-notes-app");
        try {
            const result = await fetch(`${serverBase}/session/addsession`, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwttoken}`
                },
                body: JSON.stringify({
                    title: data.title,
                    description: data.desp
                })
            });
            const resultBody = await result.json();
            if (result.ok) {

                setSession([...Sessions, {
                    id: resultBody.id,
                    title: data.title,
                    desp: data.desp,
                    owned: true
                }]);
                toast.success("session added successfully");
                setFormStatus(false);
            }
            else {
                toast.error("session could not be added");
            }
        }
        catch (error) {
            toast.error(error.message);
        }
    }


    return (
        <>
            {
                isFormOpen ? <NoteForm action={saveNote} callback={setFormStatus} /> : ''
            }
            <button className="NewNoteButton add-button" onClick={() => {
                const newStatus = !isFormOpen; setFormStatus(newStatus);
            }}>
                <div className="NewNoteButton svg-wrapper">
                    <svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <g id="plus-circle-fill">
                            <path id="Subtract"
                                d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM8.5 4.5C8.5 4.22386 8.27614 4 8 4C7.72386 4 7.5 4.22386 7.5 4.5V7.5H4.5C4.22386 7.5 4 7.72386 4 8C4 8.27614 4.22386 8.5 4.5 8.5H7.5V11.5C7.5 11.7761 7.72386 12 8 12C8.27614 12 8.5 11.7761 8.5 11.5V8.5H11.5C11.7761 8.5 12 8.27614 12 8C12 7.72386 11.7761 7.5 11.5 7.5H8.5V4.5Z"
                                fill="currentColor" />
                        </g>
                    </svg>
                </div>
            </button>
        </>
    );
} 