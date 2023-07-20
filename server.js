
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from 'jsonwebtoken'
const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const key = "secretKey1";

function generateAdminToken(username) {
    let user = { "username": username }
    const payload = user
    return jwt.sign(payload, key, { expiresIn: "1h" })
}

// Admin routes
function adminJWTAuthenticate(req, res, next) {
    const auth = req.headers.authorization;
    console.log(auth)
    if (auth) {
        const authArr = auth.split(" ");
        console.log(authArr, authArr.length)
        const token = authArr[authArr.length - 1]
        console.log("token", token)
        jwt.verify(token, key, (err, user) => {
            if (err) {
                res.status(401).send("something went wrong while verifying")
            } else {
                req.user = user
                console.log("admin", user, req.user)
                next()
            }
        })
    } else {
        res.status(401).send("please enter valid username and password")
    }
}
function generateUserToken(username) {
    let user = { "username": username }
    const payload = user
    return jwt.sign(payload, key, { expiresIn: "1h" })
}

// Admin routes
function userJWTAuthenticate(req, res, next) {
    const auth = req.headers.authorization;
    console.log("user", auth)
    if (auth) {
        const authArr = auth.split(" ");
        console.log(authArr, authArr.length)
        const token = authArr[authArr.length - 1]
        console.log(token)
        jwt.verify(token, key, (err, user) => {
            if (err) {
                res.status(401).send("something went wrong while verifying")
            } else {
                req.user = user
                next()
            }
        })
    } else {
        res.status(401).send("please enter valid username and password")
    }
}
// function userAuthenticate(req, res, next) {
//     const { username, password } = req.headers;
//     const existingUser = USERS.filter(user =>
//         user.username === username && user.password === password)
//     if (existingUser.length) {
//         req.user = existingUser[0]
//         next()
//     } else {
//         res.status(401).send("please enter valid username and password")
//     }
// }
app.post('/admin/signup', (req, res) => {
    const { username, password } = req.body
    console.log(username, password)
    const admin = ADMINS.find(admin => admin.username === username);
    if (admin) {
        res.status(403).json({ message: 'Admin already exists' });
    }
    else if (!username || !password) {
        res.status(401).send("please enter valid username and password")
    } else {
        const newAdmin = { username, password };
        ADMINS.push(newAdmin)
        console.log(ADMINS)
        const token = generateAdminToken(username)
        res.status(200).json({ message: "Admin created successfully", token })
    }
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const existingAdmin = ADMINS.filter(admin =>
        admin.username === username && admin.password === password)
    if (existingAdmin.length) {
        const token = generateAdminToken(username)
        res.status(200).json({ message: "Admin logged in successfully", token })
    } else {
        res.status(401).send("please enter valid username and password")
    }
});


app.post('/admin/courses', adminJWTAuthenticate, (req, res) => {
    const { title, description, price, imageLink, published } = req.body;
    console.log(req.body)
    if (!title || !description || !price || !imageLink) {
        res.status(411).send("please add all the course inputs")
    } else {
        let id = Math.floor(Math.random() * 1000000);
        COURSES.push({
            id, title, description, price, imageLink, published
        })
        console.log(COURSES)
        res.status(200).json({ message: 'Course created successfully', courseId: id })
    }
});
app.get("/admin/me", adminJWTAuthenticate, (req, res) => {
    const username = req.user.username
    console.log("me", req.user)
    res.status(200).json({ username })
})

app.put('/admin/courses/:id', adminJWTAuthenticate, (req, res) => {
    const id = parseInt(req.params.id)
    const existingCourse = COURSES.filter(course => course.id === id)
    // console.log("existing put", existingCourse)
    if (existingCourse.length) {
        existingCourse[0].title = req.body.title
        existingCourse[0].description = req.body.description
        existingCourse[0].price = req.body.price
        existingCourse[0].imageLink = req.body.imageLink
        existingCourse[0].published = req.body.published
        res.status(200).json({ message: `course ${id} updated successfuly` })

    } else {
        res.status(404).send("course not found")
    }
});

app.get('/admin/courses', adminJWTAuthenticate, (req, res) => {
    res.status(200).json(COURSES)
});

// User routes
app.post('/users/signup', (req, res) => {
    const { username, password } = req.body
    console.log(req.body)
    if (!username || !password) {
        res.status(401).send("please enter valid username and password")
    } else {
        USERS.push({
            username, password, purchasedCourses: []
        })
        const token = generateUserToken(username)
        console.log(USERS)
        res.status(200).send({ message: "User created successfully", token })
    }
});

app.post('/users/login', (req, res) => {
    const { username, password } = req.headers;
    const existingUser = USERS.filter(user =>
        user.username === username && user.password === password)
    if (existingUser.length) {
        const token = generateUserToken(username)
        res.status(200).send({ message: "User logged successfully", token })
    } else {
        res.status(401).send("please enter valid username and password")
    }
});

app.get('/users/courses', userJWTAuthenticate, (req, res) => {
    res.status(200).json(COURSES)
});

app.post('/users/courses/:courseId', userJWTAuthenticate, (req, res) => {
    let user = req.user;
    console.log("user", user)
    const id = parseInt(req.params.courseId)
    console.log(id)
    let purchasedCourse = COURSES.find(course => course.id === id);
    if (purchasedCourse) {
        for (let USER of USERS) {
            if (USER.username === user.username) {
                USER.purchasedCourses.push(purchasedCourse);
            } else {
                res.send("some issue, username don't match")
            }
        }
        console.log(purchasedCourse, USERS)
        res.status(200).json("course purchased successfully by " + user.username)
    } else {
        res.status(401).send("course doesn't exist")
    }
});

app.get('/users/purchasedCourses', userJWTAuthenticate, (req, res) => {
    let user = req.user
    for (let USER of USERS) {
        if (USER.username === user.username) {
            res.status(200).json({ purchasedCourses: USER.purchasedCourses })
        }
    }
    // logic to view purchased courses
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

export default app