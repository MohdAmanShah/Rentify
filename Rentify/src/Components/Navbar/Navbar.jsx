import Icon from '/Note-app-icon.jpeg';
import Account from '../Account/Account'
import { Link } from 'react-router-dom';
import './Navbar.css'
export default function Navbar() {
    return (
        <nav className="Navbar navbar bg-danger-subtle">
            <div className="container ">
                <Link className="navbar-brand" to="/">
                    <img style={{ marginRight: "12px" }} src={Icon} alt="Bootstrap" width="42" />
                    Notes
                </Link>
                <Account />
            </div>
        </nav>
    )
}


