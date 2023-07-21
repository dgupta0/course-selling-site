import { Card, TextField, Button } from "@mui/material";
import React from "react";
import { useNavigate } from 'react-router-dom';
import path from "../config"

function CreateCourse() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [url, setUrl] = React.useState("");
    const [isPublished, setIsPublished] = React.useState(false);
    const navigate = useNavigate();

    function handleCreateCourse() {
        try {
            const token = localStorage.getItem("token");
            fetch(`${path}/admin/courses/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, price, "imageLink": url, "published": isPublished }),
            })
                .then(res => res.json())
                .then(data => navigate("/courses"))

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="reg-main main-landing">
            <Card variant="outlined" className="box create-course-box">
                <h1>Create Course </h1>

                <TextField type={"text"}
                    label="Course Title"
                    variant="outlined"
                    className="input input-register"
                    value={title}
                    onChange={e => setTitle(e.target.value)}

                />
                <TextField type={"text"}
                    label="Course Description"
                    variant="outlined"
                    className="input input-register"
                    value={description}
                    onChange={e => setDescription(e.target.value)} />


                <TextField type={"number"}
                    label="Course Price"
                    variant="outlined"
                    className="input input-register"
                    value={price}
                    onChange={e => setPrice(e.target.value)} />

                <TextField type={"text"}
                    label="Course Image Url"
                    variant="outlined"
                    className="input input-register"
                    value={url}
                    onChange={e => setUrl(e.target.value)} />

                <label>
                    <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={() => setIsPublished(!isPublished)}
                        style={{ marginTop: "1rem", marginBottom: "1rem" }}
                    />
                    Is the course published?
                </label>
                <Button
                    style={{ marginBottom: "10px" }}
                    variant="contained"
                    onClick={handleCreateCourse}>
                    Create Course
                </Button>
            </Card>
        </div>
    )
}
export default CreateCourse;