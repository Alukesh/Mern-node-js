import PostModel from '../models/Post.js'


export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        })

        const post = await doc.save();
        res.json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}


export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        const tags = posts.map((obj) => obj.tags).flat().slice(0, 5)
        res.json(tags)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить tags'
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const foundPost = await PostModel.findById(postId)
        if (!foundPost) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }

        const result = await PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: { viewsCount: 1 }
            },
            {
                new: true,
                upsert: true,
                rawResult: true,
            },
        ).populate('user').exec();
        if (!result.value) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }
        res.json(result.value)
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: 'Не удалось получить статью'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId,
        },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.user,
            },)
        res.json({
            success: true
        })

    } catch (error) {
        console.log(error);
        res.json({
            message: 'Не удалось обновить статью'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const result = await PostModel.findOneAndDelete({
            _id: postId,
        },
        )
        res.json({
            message: 'Пост был удален'
        })
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: 'Не удалось remove статью'
        })
    }
}

