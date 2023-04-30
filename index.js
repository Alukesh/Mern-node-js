import express from 'express'
import cors from 'cors'
import multer from 'multer';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js'
import { handleValidationErrors} from './utils/insex.js'


import { UserController, PostController} from './controllers/index.js';

import CheckAuth from './middleware/CheckAuth.js';
mongoose.connect(
    process.env.MONGODB_URI
).then(() => console.log('DB ok'))
    .catch(err => console.log('DB error', err))

const app = express();
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(cors())

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