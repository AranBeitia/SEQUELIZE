const { User, Post } = require('../models/index.js')

const UserController = {
	create(req, res) {
		req.body.role = 'user'
		User.create(req.body)
			.then((user) =>
				res.status(201).send({ message: 'Usuario creado con éxito', user })
			)
			.catch((error) => {
				console.log(error)
				res.status(500).send({ message: 'An error happened' })
			})
	},
	getAll(req, res) {
		User.findAll({
			include: [Post],
		})
			.then((users) => res.send(users))
			.catch((err) => {
				console.log(err)
				res.status(500).send({
					message: 'Ha habido un problema al cargar las publicaciones',
				})
			})
	},
	async getUserById(req, res) {
		try {
			const user = await User.findByPk(req.params.id, {
				include: [Post],
			})
			res.send(user)
		} catch (error) {
			res.send('Error fatal')
		}
	},
	async delete(req, res) {
		await User.destroy({
			where: {
				id: req.params.id,
			},
		})
		await Post.destroy({
			where: {
				UserId: req.params.id,
			},
		})
		res.send('El usuario ha sido eliminado con éxito')
	},
	async update(req, res) {
		await User.update(
			{ name: req.body.name, email: req.body.email },
			{ where: { id: req.params.id } }
		)
		res.send('Usuario actualizado con éxito')
	},
}

module.exports = UserController
