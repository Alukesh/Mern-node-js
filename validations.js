import {body} from 'express-validator'

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть от 4 до 10 символов').isLength({ min: 4, max: 10 }),
    body('fullName', 'Имя не должно содержать менее 3 символов').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
]
export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть от 4 до 10 символов').isLength({ min: 4, max: 10 }),
]
export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите описание статьи').isLength({ min: 5 }).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]