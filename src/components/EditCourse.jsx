import React from "react";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Card, TextField, Button, CardActionArea, CardActions, Typography, CircularProgress } from "@mui/material";
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import path from "../config"

function EditCourse() {
    const [editedCourse, setCourse] = useState(null)
    const { id } = useParams();
    console.log('id:', id);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [url, setUrl] = useState("");
    const [isPublished, setIsPublished] = useState(false);
    const [loading, setIsLoading] = React.useState(false)

    useEffect(() => {

        try {
            const token = localStorage.getItem("token");
            fetch(`${path}/admin/courses`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setCourse(data.find(course => {
                        console.log(course.id, id)
                        console.log(course.id === parseInt(id))
                        if (course.id === parseInt(id)) {
                            setTitle(course.title),
                                setDescription(course.description),
                                setPrice(course.price),
                                setUrl(course.imageLink),
                                setIsPublished(course.published)
                            return course
                        }
                    }))
                })
        } catch (error) {
            console.log(error)
        }
    }, [])
    console.log(editedCourse, title, description)
    function handleEditCourse() {
        setIsLoading(true)
        try {
            const token = localStorage.getItem("token");
            fetch(`${path}/admin/courses/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, price, "imageLink": url, "published": isPublished }),
            })
                .then(res => {
                    console.log("res", res)
                    res.json()
                })
                .then(data => navigate("/courses"))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="edit-landing" style={{ padding: "1rem", backgroundColor: "#5f5f21", display: "flex", justifyContent: "space-evenly", gap: "1rem", minHeight: "87vh" }}>
            <Card className="edit-card edit-card1" variant="outlined" style={{ display: "flex", flexDirection: "column", padding: "1rem" }}>
                <h1 style={{ textAlign: "center" }}>Edit Course </h1>

                <TextField type={"text"}
                    variant="outlined"
                    className="input input-register"
                    value={title}
                    onChange={e => setTitle(e.target.value)}

                />
                <TextField type={"text"}
                    variant="outlined"
                    className="input input-register"
                    value={description}
                    onChange={e => setDescription(e.target.value)} />


                <TextField type={"number"}
                    variant="outlined"
                    className="input input-register"
                    value={price}
                    onChange={e => setPrice(e.target.value)} />

                <TextField type={"text"}
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
                    onClick={handleEditCourse}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Done'}
                </Button>
            </Card>
            <Card className="edit-card edit-card2" style={{ padding: "1rem" }}>
                <h1 style={{ textAlign: "center" }}>Preview </h1>
                <CardActionArea>
                    <CardMedia
                        className="edit-course-img"
                        component="img"
                        height="240"
                        image={url}
                        alt="green iguana"
                    />
                    <CardContent>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {title}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                                ${price}
                            </Typography>
                        </div>
                        <Typography variant="body2" color="text.secondary">
                            {description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary">
                        Edit Course
                    </Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default EditCourse;