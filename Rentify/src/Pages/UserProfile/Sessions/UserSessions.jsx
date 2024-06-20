import { toast } from 'react-toastify';
import { serverBase } from '../../../Configs/Server.js';
import { useEffect, useState } from 'react';

import Loading from '../../../Components/Loading/Loading.jsx';

import './UserSessions.css';

export default function UserSessions() {
    const token = localStorage.getItem('jwt-notes-app');
    const [sessionData, setSessionData] = useState(null);
    useEffect(() => {
        getAllSessions();
    }, []);
    async function getAllSessions() {
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
                const newArray = resultBody.session.map(({ id, title, description, lastModifiedDate, createdDate, ownerId }) => ({
                    id,
                    owned: (ownerId === resultBody.id),
                    title,
                    desp: description,
                    lastModifiedDate: getDateTime(lastModifiedDate),
                    createdDate: getDateTime(createdDate)
                }));
                setSessionData(newArray);
            } catch (err) {
                console.log(err);
            }
        }
        else {
            toast.error("Invalid token");
        }
    }


    const getDateTime = dateTime => {
        const _dateTime = new Date(dateTime)
        return `${_dateTime.toLocaleDateString()} ${_dateTime.toLocaleTimeString()}`;
    }

    if (sessionData == null) {
        return (
            <div>
                <Loading />
            </div>
        )
    }
    else {
        return (
            <div>
                {sessionData.map((session) => {
                    return (
                        <div className="UserSession wrapper" key={session.id}>
                            <div>
                                <div className="UserSession session">
                                    <div className='name'>
                                        <h3>{session.title}</h3>
                                        <span>{(session.owned) ? "Owned" : "Invited"}</span>
                                    </div>
                                    <div className='dates'>
                                        <div>
                                            <span>date created :</span>
                                            <time>{session.createdDate}</time>
                                        </div>
                                        <div>
                                            <span>last modified :</span>
                                            <time>{session.lastModifiedDate
                                            }</time>
                                        </div>
                                    </div>
                                    <p>
                                        {session.desp}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

}