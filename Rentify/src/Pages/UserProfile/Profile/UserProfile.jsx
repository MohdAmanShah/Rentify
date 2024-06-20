import { useEffect, useState, useRef } from "react";
import { serverBase } from "../../../Configs/Server.js";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import Loading from '../../../Components/Loading/Loading.jsx';
import DefaultProfile from '/profileimageplaceholder.jpg';
import "./UserProfile.css";
export default function UserProfile() {

    const inputElement = useRef();
    const imageElement = useRef();
    const [image, setImage] = useState(null);
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("");
    const token = localStorage.getItem("jwt-notes-app");
    useEffect(() => {
        getUser();
    }, []);



    function LoadProfileImage() {
        const image = inputElement.current.files[0];
        if (!image.type.includes("image")) {
            toast.error("Upload only image");
            return;
        }
        imageElement.current.src = URL.createObjectURL(image);
        imageElement.current.onload = () => {
            URL.revokeObjectURL(imageElement.current.src);
        }
    }

    async function uploadImage() {
        const image = inputElement.current.files[0];
        console.log(image);
        if (!image) {
            toast.error("No image found");
            return;
        }
        if (!image.type.includes("image")) {
            toast.error("Upload only Image");
            return;
        }
        const form = new FormData();
        form.append('file', image);
        try {
            const result = await fetch(`${serverBase}/userprofile/uploadimage`, {
                method: 'post',
                headers: {
                    'authorization': `Bearer ${token}`
                },
                body: form
            });
            const resultBody = await result.json();
            console.log(resultBody.message);
        }
        catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    }

    async function getUser() {
        try {
            const result = await fetch(`${serverBase}/userprofile`, {
                method: 'get',
                headers: {
                    'content-type': "application/json",
                    'authorization': `Bearer ${token}`
                }
            });
            const resultBody = await result.json();
            setUser(resultBody);
            setUserName(resultBody.userName);
        } catch (err) {
            toast.error(err.message);
        }
    }


    async function updateUser() {
        try {
            if (userName === user.userName) {
                toast.error("No changes found");
                return;
            }
            const User = user;
            User.userName = userName;
            console.log(User);
            const result = await fetch(`${serverBase}/userprofile/updateuser`, {
                method: "put",
                headers: {
                    'content-type': "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify(user)
            })
            const resultBody = await result.json();
            const message = resultBody.message;

            if (result.ok) {
                toast.success(message);
            }
            else {
                toast.error(result.message);
            }
        }
        catch (err) {
            console.log(err)
            toast.error(err.message);
        }
    }



    if (user)
        return (
            <div className="row">
                <div className="col-12 col-lg-6">

                    <div className="profile-image mb-4 p-1">
                        <img ref={imageElement} src={user.profileImage ? user.profileImage : DefaultProfile} alt={userName} />
                    </div>
                    <div className="mb-4">
                        <input accept="image/*" ref={inputElement} hidden type="file" name="profileimage" id="profileimage" onChange={e => {
                            LoadProfileImage();
                        }} />
                        <div>
                            <label htmlFor="profileimage" className="btn btn-primary me-2 mb-2" >Change profile image</label>
                            <button className="btn btn-outline-primary mb-2" onClick={uploadImage}>Upload Image</button>
                        </div>
                    </div>

                    <form>
                        <div className="form-floating mb-3">
                            <input disabled type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={user.email} />
                            <label htmlFor="floatingInput">Email address</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="floatingName" placeholder="Username" value={userName} onChange={e => {
                                setUserName(e.target.value)
                            }} />
                            <label htmlFor="floatingName">Username</label>
                        </div>
                        <Link to="changepassword"><button type="button" className="w-100 btn btn-lg btn-secondary mb-3">Change Password</button></Link>
                        <button type="submit" className="w-100 btn btn-lg btn-primary" onClick={e => { e.preventDefault(); updateUser(); }} >Save</button>
                    </form>

                </div>
            </div>)
    else {
        return (
            <Loading />
        )
    }

}