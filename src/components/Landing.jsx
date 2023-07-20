
import React from "react";
import cover from "../assets/cover.jpg";
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
    const navigate = useNavigate()
    return <div className="main-landing" style={{ display: "flex", backgroundColor: "#f0f5f4", margin: "auto" }}>
        <img className="cover-img" src={cover}
            alt="cover image" />
        <div className="body-landing" style={{ margin: "auto" }}>
            <Typography style={{ paddingBottom: "0.5rem" }} variant="h4" component="h4">
                Hey Admin
            </Typography>
            <Typography
                style={{ paddingBottom: "0.5rem" }}
                variant="h6" component="h6">
                Welcome to Course Selling Website
            </Typography>
            <Button
                className="land-btn"
                style={{ marginRight: "0.5rem" }}
                variant="solid" component="a" href="/register">
                Register
            </Button>
            <Button
                className="land-btn"
                variant="solid"
                style={{ marginRight: "0.5rem" }}
                onClick={() => navigate("/login")}>
                Login
            </Button>
        </div>
    </div >
}

export default Landing;