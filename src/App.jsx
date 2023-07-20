import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Landing from "./components/Landing";
import CreateCourse from './components/CreateCourse';
import Register from './components/Register';
import ShowCourses from './components/ShowCourses';
import EditCourse from './components/EditCourse';
import Topbar from './components/topbar';
import "./App.css"
import LoginContext from './context/LoginContext';



// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {

    const [isLogged, setIsLogged] = React.useState(false);
    React.useEffect(() => {
        if (localStorage.getItem("token") === null) {
            setIsLogged(false)
        } else {
            setIsLogged(true)
        }
    }, [])

    return (
        <LoginContext.Provider value={{ isLogged, setIsLogged }}>
            <Router>
                <Topbar />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/create" element={<CreateCourse />} />
                    <Route path="/courses" element={<ShowCourses />} />
                    <Route path="/courses/:id" element={<EditCourse />} />
                </Routes>
            </Router >
        </LoginContext.Provider>
    );
}

export default App;