import React from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Typography, TextField, Button } from '@mui/material';
import { useContext } from "react";
import LoginContext from "../context/LoginContext"
import path from "../config"

function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const { setIsLogged } = useContext(LoginContext)
    const navigate = useNavigate()

    function handleLogin() {
        try {
            fetch(`${path}/admin/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "username": email, password }),
            })
                .then(res => {
                    if (res.ok) {
                        console.log("okay from login")
                        return res.json()
                    }
                })
                .then(data => {
                    console.log(data.token)
                    localStorage.setItem("token", data.token)
                    setIsLogged(true)
                    navigate("/create")
                })
        } catch (error) {
            console.log("error", error)
        }
    }

    return <div className="reg-main login-main main-landing">
        <Card variant="outlined" className="box">
            <h1> Login to admin dashboard</h1>
            <TextField type={"text"}
                label="Email"
                variant="outlined"
                className="input input-register"
                onChange={e => setEmail(e.target.value)}

            />
            <TextField type={"password"}
                label="password"
                variant="outlined"
                className="input input-register"
                onChange={e => setPassword(e.target.value)}
            />
            <Button
                style={{ marginBottom: "10px" }}
                variant="contained"
                onClick={handleLogin}>
                Submit
            </Button>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h6" >
                    Not an existing admin?
                    < a href="/register" className="anchor">Register here</a>
                </Typography>
            </div>
        </Card>
    </div>
}

export default Login;