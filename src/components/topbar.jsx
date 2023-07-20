import React from "react";
import "../App.css"
import { Button, Typography, Menu, MenuItem } from '@mui/material';
import { useContext } from "react";
import LoginContext from "../context/LoginContext"
import { useNavigate } from 'react-router-dom';
import menu from "../assets/menu.png";


function Topbar() {
    // MUI code for creating menus until line 19
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const { isLogged, setIsLogged } = useContext(LoginContext)
    const [user, setUser] = React.useState("");
    const navigate = useNavigate()

    React.useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:3000/admin/me/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }).then(res => res.json())
            .then(data => setUser(data.username.split("@")[0]))
            .catch(err => console.log(err))
    }, [isLogged])

    function handleSideBarLogout() {
        setUser("")
        localStorage.removeItem("token")
        setIsLogged(false)
        navigate("/login")
    }
    function handleCreateCourse() {
        navigate("/create")
    }
    function handleShowCourse() {
        navigate("/courses")
    }
    function handleTitleClick() {
        isLogged ? navigate("/courses") : navigate("/")
    }
    return (
        <div className="header">
            <Typography variant="h5"
                onClick={handleTitleClick} style={{ cursor: "pointer" }}>
                XCourses
            </Typography>
            <header className="max-header" style={{ display: "flex", marginLeft: "auto" }}  >
                {isLogged ?
                    (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography style={{ marginRight: "0.35rem" }}
                                variant="h6" component="h6">
                                Hello {user}
                            </Typography>
                            <Button
                                style={{ border: "black", color: "black" }}
                                variant="outlined"
                                onClick={handleCreateCourse}
                            >
                                Create Course
                            </Button>
                            <Button
                                style={{ border: "black", color: "black" }}
                                variant="outlined"
                                onClick={handleShowCourse}
                            >
                                Show Courses
                            </Button>

                            <Button
                                className="side-btn"
                                variant="solid"
                                onClick={handleSideBarLogout}
                            >
                                Logout
                            </Button>
                        </div>

                    )
                    :
                    <div style={{ display: "flex", marginLeft: "auto" }}>
                        <Button
                            className="side-btn top-btn"
                            variant="solid" component="a" href="/register">
                            Register
                        </Button>
                        <Button
                            className="side-btn"
                            variant="solid"
                            component="a" href="/login">
                            Login
                        </Button>
                    </div>
                }

            </header>
            <header className="min-header" >
                <div>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <h4 style={{ color: "black", whiteSpace: "nowrap" }}>hello {isLogged ? `${user}` : ""}</h4>
                            <img src={menu} style={{ width: "28px", height: "25px" }} alt="menu icon by freepik" />
                        </div>
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}>
                        {isLogged ?
                            (
                                <div>
                                    <MenuItem onClick={handleCreateCourse}>Create Course</MenuItem>
                                    <MenuItem onClick={handleShowCourse}>Show Course</MenuItem>
                                    <MenuItem onClick={handleSideBarLogout}>Logout</MenuItem>

                                </div>
                            )
                            :
                            (
                                <div>
                                    <MenuItem onClick={() => navigate("/register")}>Register</MenuItem>
                                    <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>

                                </div>
                            )
                        }

                    </Menu>
                </div>
            </header>
        </div>
    )
}

export default Topbar;
