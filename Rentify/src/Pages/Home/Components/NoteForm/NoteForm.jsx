import "./NoteForm.css";
import { useState } from "react";

export default function NoteForm({ action, callback, session = null }) {

    const [title, setTitle] = useState(session ? session.title : "");
    const [desp, setDesp] = useState(session ? session.desp : "");



    return (
        <div className="NoteForm wrapper">
            <div className="close-button">
                <button onClick={() => { callback(false) }}>
                    ✖
                </button>
            </div>
            <div className="container-fluid">
                <form>
                    <div className="NoteForm form-element">
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" id="title" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="NoteForm form-element">
                        <label htmlFor="desp">Description</label>
                        <textarea rows={6} name="desp" id="desp" value={desp} onChange={e => setDesp(e.target.value)}></textarea>
                    </div>
                    <div className="NoteForm form-btn">
                        <input type="submit" value={"Save"} onClick={(e) => {
                            e.preventDefault();
                            action({ title, desp });
                        }} />
                        <input type="reset" value={"Reset"} />
                    </div>
                </form>
            </div>
        </div>
    )
}