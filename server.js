
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const app = express();
const password = "MerUMZDbEafdixt6";

const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(bodyParser.json());
app.use(express.json());

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
})

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
})

const CourseSchema = mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
})

const Admin = mongoose.model("Admin", AdminSchema)
const USER = mongoose.model("USER", UserSchema)
const Course = mongoose.model("Course", CourseSchema)

mongoose.connect(`mongodb+srv://deetigupta8:${password}@cluster0.ewhiqzs.mongodb.net/courses`, { useNewUrlParser: true, useUnifiedTopology: true });

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

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
app.post('/admin/signup', async (req, res) => {
    const { username, password } = req.body
    console.log(username, password)
    const admin = await Admin.findOne({ username })
    // ADMINS.find(admin => admin.username === username);
    if (admin) {
        res.status(403).json({ message: 'Admin already exists' });
    }
    else if (!username || !password) {
        res.status(401).send("please enter valid username and password")
    } else {
        const admin = { username, password };
        const newAdmin = new Admin(admin)
        await newAdmin.save()
        // ADMINS.push(newAdmin)
        // console.log(ADMINS)
        const token = generateAdminToken(username)
        res.status(200).json({ message: "Admin created successfully", token })
    }
});

app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const existingAdmin = await Admin.findOne({ username, password })
    // const existingAdmin = ADMINS.filter(admin =>
    //     admin.username === username && admin.password === password)
    if (existingAdmin) {
        const token = generateAdminToken(username)
        res.status(200).json({ message: "Admin logged in successfully", token })
    } else {
        res.status(401).send("please enter valid username and password")
    }
});


app.post('/admin/courses', adminJWTAuthenticate, async (req, res) => {
    const { title, description, price, imageLink, published } = req.body;
    console.log(req.body)
    if (!title || !description || !price || !imageLink) {
        res.status(411).send("please add all the course inputs")
    } else {
        let id = Math.floor(Math.random() * 1000000);
        let course = { id, title, description, price, imageLink, published }
        let newCourse = new Course(course)
        await newCourse.save()
        // COURSES.push({
        //     id, title, description, price, imageLink, published
        // })
        // console.log(COURSES)
        res.status(200).json({ message: 'Course created successfully', courseId: id })
    }
});
app.get("/admin/me", adminJWTAuthenticate, (req, res) => {
    const username = req.user.username
    console.log("me", req.user)
    res.status(200).json({ username })
})

app.put('/admin/courses/:id', adminJWTAuthenticate, async (req, res) => {
    const id = parseInt(req.params.id)
    const existingCourse = await Course.findOneAndUpdate({ id }, {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        imageLink: req.body.imageLink,
        published: req.body.published

    })
    // const existingCourse = COURSES.filter(course => course.id === id)
    // console.log("existing put", existingCourse)
    if (existingCourse) {
        res.status(200).json({ message: `course ${id} updated successfuly` })

    } else {
        res.status(404).send("course not found")
    }
});

app.get('/admin/courses', adminJWTAuthenticate, async (req, res) => {
    let courses = await Course.find()
    res.status(200).json(courses)
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

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

export default app