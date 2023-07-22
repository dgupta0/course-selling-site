import React from "react";
import { Card, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import LoginContext from "../context/LoginContext";
import path from "../config"

function Register() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const { setIsLogged } = useContext(LoginContext)
    const [loading, setIsLoading] = React.useState(false)
    const navigate = useNavigate()

    async function handleRegister() {
        setIsLoading(true)
        try {
            console.log("path", path)
            const res = await fetch(`${path}/admin/signup/`, {
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
                onClick={handleRegister}
                disabled={loading}
            >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Register'}
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