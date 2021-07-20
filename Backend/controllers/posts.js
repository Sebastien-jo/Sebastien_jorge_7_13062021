const multer = require('../middleware/multer-config');
const models = require('../models');
const fs = require('fs');


// Création d'un nouveau post
exports.createPost = async (req, res) => {
	try {

		// user
		const findUser = await models.User.findOne({
			attributes: ['email', 'firstName'],
			where: { id: req.user.id },
		});

		if (!findUser) {
			throw new Error("Sorry,we can't find your account");
		} 
		
		if (req.file) {
			attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
		}else {
			attachment = null;
		}
		// post
		const postObject = JSON.parse(req.body.post);
		delete req.body._id;
		const newPost = await models.Posts.create({
			...postObject,
			attachment: attachment,
			UserId: req.user.id,
			isModerate: 0,
			
		});

		if (!newPost) {
			throw new Error(' Sorry, missing parameters');
		}

		res.status(200).json({ newPost });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};


exports.getAllPosts = async (req, res) => {
	try {
		const fields = req.query.fields;
		const order = req.query.order;

		const posts = await models.Posts.findAll({
			order: [order != null ? order.split(':') : ['createdAt', 'DESC']],
			attributes: fields != '*' && fields != null ? fields.split(',') : null,
			include: [
				{
					model: models.User,
					attributes: ['email', 'isAdmin', 'id', 'firstName', 'lastName'],
				},
				{
					model: models.Comment,
					attributes: ['comments', 'UserId', 'id', 'PostId', 'createdAt'],
					include: {model: models.User, attributes: ['firstName', 'lastName']}
				},

				
			],
		});          
		if (!posts) {
			throw new Error(' Sorry , nothing to fetch');
		}
		res.status(200).send(posts);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};



exports.deletePost = async (req, res) => {
	try {
		
		const post = await models.Posts.findOne({
			where: { id: req.params.id },
		});

		// attachment
		if (post.attachment !== null) {
			const filename = post.attachment.split('/images')[1];
			fs.unlink(`images/${filename}`, (error) => {
				error ? console.log(error) : console.log('file has been deleted');
			});
		}

		if (!post) {
			throw new Error("Sorry,your post doesn't exist ");
		}

		// post
		const destroyedPost = await models.Posts.destroy({
			where: { id: req.params.id },
		});

		if (!destroyedPost) {
			throw new Error('Sorry,something gone wrong,please try again later');
		} else {
			res.status(200).json({ message: 'Post has been deleted ' });
		}

		// comment
		const destroyedComment = await models.Comment.destroy({
			where: { id: req.params.id },
		});

		if (!destroyedComment) {
			throw new Error('Sorry,something gone wrong,please try again later');
		} else {
			res.status(200).json({ message: 'Your comment has been deleted' });
		}
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

// PROJET AMELIORATION
/*exports.updatePost = async (req, res) => {
	try {
		const attachmentURL = `${req.protocol}://${req.get('host')}/images/${
			req.file.filename
		}`;

		if (!attachmentURL) {
			throw new Error('Sorry,something gone wrong , please try again later');
		}

		const postFound = await models.Posts.findOne({
			where: { id: req.params.id },
		});

		if (!postFound) {
			throw new Error("Sorry,can't find your post");
		}

		if (postFound && postFound.UserId !== req.user.id) {
			res.status(400).json({ error: error.message });
		}

		await postFound.update({
			title: req.body.title,
			content: req.body.content,
			attachment: attachmentURL,
			userId: req.user.id,
		});

		res.status(201).json({
			message: ' Your post has been updated',
			PostUpdated: postFound,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	
};*/