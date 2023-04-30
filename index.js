import express from 'express'
import cors from 'cors'
import multer from 'multer';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js'
import { handleValidationErrors } from './utils/insex.js'


import { UserController, PostController } from './controllers/index.js';

import CheckAuth from './middleware/CheckAuth.js';
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('DB ok'))
    .catch(err => console.log('DB error', err))

const app = express();
const cors = require("cors");
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}))
//   app.options('*', cors());
app.use((req, res, next) => {
    //allow access from every, elminate CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.removeHeader('x-powered-by');
    //set the allowed HTTP methods to be requested
    res.header(`Access-Control-Allow-Methods`, `GET,PATCH,POST,DELETE`);
    //headers clients can use in their requests
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //allow request to continue and be handled by routes
    next();
});

const storage = multer.diskStorage({
    destination: (_, __, callback) => {
        callback(null, 'uploads')
    },
    filename: (_, file, callback) => {
        callback(null, file.originalname)
    },
})

const upload = multer({ storage })
app.post('/upload', CheckAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.get('/auth/me', CheckAuth, UserController.getUser)

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', CheckAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', CheckAuth, PostController.remove)
app.patch('/posts/:id', CheckAuth, postCreateValidation, PostController.update)


app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log('Server bad', err);
    }
    console.log('Server OK');
})