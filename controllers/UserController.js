const { User, Post, Token, Sequelize } = require('../models/index.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { jwt_secret } = require('../config/config.json')['development']
const { Op } = Sequelize
const transporter = require('../config/nodemailer')

const UserController = {
	create(req, res, next) {
		req.body.role = 'user'
		const password = bcrypt.hashSync(req.body.password, 10)

		User.create({ ...req.body, password, confirmed: false })
			.then((user) => {
				res.status(201).send({ message: 'Usuario creado con éxito', user })

				const emailToken = jwt.sign({ email: req.body.email }, jwt_secret, {
					expiresIn: '48h',
				})
				const url = 'http://localhost:3000/users/confirm/' + emailToken

				transporter.sendMail({
					to: req.body.email,
					subject: 'Confirme su registro',
					html: `<h3>Bienvenido, estás a un paso de registrarte </h3>
								<a href="${url}"> Click para confirmar tu registro</a>
					`,
				})
			})
			.catch((error) => {
				// res.status(500).send({ message: 'An error happened', error })
				next(error)
			})
	},
	getAll(req, res) {
		User.findAll({
			include: [Post],
		})
			.then((users) => res.status(200).send(users))
			.catch((err) => {
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
			res.send('Error fatal', error)
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
	login(req, res) {
		User.findOne({
			where: {
				email: req.body.email,
			},
		}).then((user) => {
			if (!user) {
				return res
					.status(400)
					.send({ message: 'Usuario o contraseña incorrectos' })
			}
			const isMatch = bcrypt.compareSync(req.body.password, user.password)

			if (!user.confirmed) {
				return res.status(400).send({ message: 'Debes confirmar tu correo' })
			}

			if (!isMatch) {
				return res
					.status(400)
					.send({ message: 'Usuario o contraseña incorrectos' })
			}
			const token = jwt.sign({ id: user.id }, jwt_secret)
			Token.create({ token, UserId: user.id })
			res.send({ message: 'Bienvenid@ ' + user.name, user, token })
		})
	},
	async logout(req, res) {
		try {
			await Token.destroy({
				where: {
					[Op.and]: [
						{ UserId: req.user.id },
						{ token: req.headers.authorization },
					],
				},
			})
			res.send({ message: 'Desconectado con éxito' })
		} catch (error) {
			console.log(error)
			res
				.status(500)
				.send({ message: 'hubo un problema al tratar de desconectarte' })
		}
	},
	async confirm(req, res) {
		try {
			const token = req.params.emailToken
			const payload = jwt.verify(token, jwt_secret)
			User.update(
				{ confirmed: true },
				{
					where: {
						email: payload.email,
					},
				}
			)
			res.status(201).send('Usuario confirmado con éxito')
		} catch (error) {
			console.error(error)
		}
	},
}

module.exports = UserController
