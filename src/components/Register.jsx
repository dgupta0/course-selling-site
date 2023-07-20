import React from "react";
import { Card, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import LoginContext from "../context/LoginContext";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const { setIsLogged } = useContext(LoginContext)
    const navigate = useNavigate()

    async function handleRegister() {
        try {
            const res = await fetch("http://localhost:3000/admin/signup/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "username": email, password }),
            })
            const data = await res.json()
            localStorage.setItem("token", data.token)
            setIsLogged(true)
            navigate("/create")
        } catch (error) {
            console.log("error", error)
        }
    }

    return <div className="reg-main main-landing">
        <Card variant="outlined" className="box">
            <h1>Register to admin dashboard</h1>

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
                onClick={handleRegister}>
                Submit
            </Button>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h6" >
                    Already an admin?
                    <a href="/login" className="anchor">Login</a>
                </Typography>
            </div>

        </Card>
    </div>
}

export default Register;