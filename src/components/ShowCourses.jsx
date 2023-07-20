import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

function ShowCourses() {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            fetch("http://localhost:3000/admin/courses", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => res.json())
                .then(data => {
                    setCourses(data)
                })
        } catch (error) {
            console.log(error)
        }
    }, [])

    return <div>
        <Typography style={{ textAlign: "center", paddingTop: "1rem" }} variant="h4" component="h4">
            Courses
        </Typography>
        <div className="" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", padding: "1rem", margin: "auto", justifyContent: "center" }}>
            {courses.map(c =>
                <Course
                    key={c.id}
                    title={c.title}
                    desc={c.description}
                    price={c.price}
                    id={c.id}
                    img={c.imageLink}
                    navigate={navigate}
                />
            )}
        </div>
    </div>
}

function Course(props) {
    return <Card className="show-course-card" style={{ boxShadow: "5px 10px 8px #888888", flexGrow: "1", padding: "1rem" }}>
        <CardActionArea>
            <CardMedia
                className="courses-img"
                component="img"
                height="140"
                image={props.img}
                alt="green iguana"
            />
            <CardContent>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.title}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        ${props.price}
                    </Typography>
                </div>
                <Typography variant="body2" color="text.secondary">
                    {props.desc}
                </Typography>
            </CardContent>
        </CardActionArea>
        <CardActions>
            <Button size="small" color="primary"
                onClick={() => props.navigate(`/courses/${props.id}`)}>
                Edit Course
            </Button>
        </CardActions>
    </Card>
}



export default ShowCourses;