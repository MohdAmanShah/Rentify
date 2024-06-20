import { useEffect } from 'react';
import './Sidenavbar.css'
import { Link } from 'react-router-dom'
export default function SideNavBar() {

    useEffect(() => {
        const url = new URL(location.href);
        const path = url.pathname;
        const lis = document.querySelectorAll(".Sidebar li");
        Array.from(lis).forEach(li => li.classList.remove('active'));
        switch (path) {
            case '/userprofile':
                document.querySelector(`li[data-url='${path.replace("/userprofile", "")}']`).classList.add("active");
                break;
            case '/userprofile/sessions':
                document.querySelector(`li[data-url='${path.replace("/userprofile", "")}']`).classList.add("active");
                break;
            case '/userprofile/friends':
                document.querySelector(`li[data-url='${path.replace("/userprofile", "")}']`).classList.add("active");
                break;
            default:
                break;
        }
    });



    return (
        <div className="Sidebar wrapper">
            <nav>
                <div hidden className='Sidebar toggle-button'>
                    <button>Toggle</button>
                </div>
                <ul onClick={(e) => {
                    const ul = e.target.closest('ul');
                    const lis = ul.getElementsByTagName('li');
                    const sli = e.target.closest('li');
                    if (sli) {

                        Array.from(lis).forEach((li) => {
                            if (li)
                                li.classList.remove('active');
                        });
                        sli.classList.add('active');
                    }
                }}>
                    <li data-url={""}>
                        <Link to={""}>
                            Profile
                        </Link>
                    </li>
                    <li data-url={"/sessions"}>
                        <Link to={"sessions"} >
                            Sessions
                        </Link>
                    </li>
                    <li data-url={"/friends"}>
                        <Link to={"friends"} >
                            Friend List
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}