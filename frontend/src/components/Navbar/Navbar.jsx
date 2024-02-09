// frontend/src/components/Navbar/Navbar.jsx

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../assets/acebook.svg"
import "./Navbar.css"
import { Friend } from "../Friend/Friend";
import { getUserByName } from "../../services/users";

const Navbar = () => {
    const navigate = useNavigate();
    const id = window.localStorage.getItem("id")
    const token = window.localStorage.getItem("token")
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([])

    const logout = () => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("id");
        navigate("/")
    }
    const profilePage = (id) => {
        navigate(`/profile/${id}`);
    };
    const home = () => {
        navigate("/posts")
    }
    const settingsPage = () => {
        navigate("/settings")
    }

    const handleSearchChange = async (e) => {
        await setSearchTerm(e.target.value);
    };

    useEffect(() => {
        if (searchTerm.trim().length >= 1) {
            getUserByName(token, searchTerm)
            .then((data) => {
                setSearchResults(data.users)
            })
        }
        
    }, [searchTerm])

    return (
        <nav>
            <div onClick={home} className="logoAndText">
                <img src={logo} alt="Acebook Logo" className="logo" />
                <p>Acebook</p>
            </div>
            
            <div className="pageButtons">
                <button onClick={home}>Home</button>
                <button onClick={() => profilePage(id)}>Profile</button>
                <button onClick={settingsPage}>Settings</button>
                <button onClick={logout}>Logout</button>
            </div>
            <input type="text" 
            placeholder="Search.." 
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    console.log("enter pressed")
                }
            }}></input>
            {searchTerm.length >= 1 ? <div className="search-results">
                {searchResults.length < 1 ? <p>No results to display</p> :
                searchResults.map((user) => {
                    return(<Friend friend={{...user, user_id: user._id}} key={user._id}/>)
                })
                }
            </div> : null}
        </nav>
    );

};


export default Navbar;

