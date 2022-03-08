const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Todo = require('./models/todo')
const Auth = require('./models/auth')
//const authMiddleware = require('./middlewares/auth')

mongoose.connect('mongodb://localhost/firstmongo') //database named firstmongo inside localhost

app.use('/', express.static(path.resolve(__dirname, 'assets/auth')))
app.use('/ragister', express.static(path.resolve(__dirname, 'assets/ragister')))
app.use('/home', express.static(path.resolve(__dirname, 'assets/home'))) // TypeError: Router.use() requires a middleware function but got a Promise

app.use(bodyParser.json())

app.post('/auth/login', async (req, res) => {
	const user = await Auth.findOne(req.body)
	console.log(user);
	if (user)
		res.json({ status: 'authorisation successfull !  now you are loged inn ', user_ID: user.user_ID })
	else
		res.json({ status: 'authentication failed' })
})
/**
 *  Failed to execute 'fetch' on 'Window': Request with GET/HEAD method cannot have body.
	at HTMLButtonElement.authoriseUser
 */
app.post('/auth/ragister', async (req, res) => {
	const user = req.body
	console.log(req.body)

	// * CREATE (_C_RUD)
	if (await Auth.findOne(user))
		res.json({ status: 'this username is taken, please login, or choose different name !' })
	else
		responseUser = await Auth.create(req.body) //POST

	console.log(responseUser)

	res.json({ status: 'ragistration successfull !  now please login ' }) //* how to access this in frontend? if its a fetch request, do .then(r=>r.json())
})


const authorise = async (user_ID) => {
	console.log((typeof user_ID == 'Number'),typeof user_ID, user_ID)
	if (typeof user_ID == 'number' || typeof user_ID == 'string') {
		console.log(user_ID, typeof user_ID == 'Number')
		isAuth = await Auth.findOne({ user_ID: user_ID })
		return true;
	} else {
		console.log(false)
		return false;
	}
	//if(!isAuth)
}


app.get('/api/get', async (req, res) => {
	let isAuth = await authorise(req.query.user_ID)
	if (isAuth) {
		const records = await Todo.find({user_ID : req.query.user_ID}) //GET
		//console.log('Response => ', records)
		res.json(records)
	} else {
		res.json({ status: "unauthorised" })
	}
})

app.post('/api/delete', async (req, res) => {
	let isAuth = await authorise(req.query.user_ID)
	if (isAuth)  {
		const { record } = req.body
		//onsole.log(record, '/api/delete')

		const response = await Todo.deleteOne({ record })

		//console.log(response, '/api/delete repsonse')

		res.json({ status: 'ok' })
	} else {
		res.json({ status: "unauthorised" })
	}
})

app.post('/api/modify', async (req, res) => {
	let isAuth = await authorise(req.query.user_ID)
	if (isAuth)  {
		const { old: oldTitle, new: newTitle } = req.body

		const response = await Todo.updateOne( //POST
			{
				record: oldTitle
			},
			{
				$set: {
					record: newTitle
				}
			}
		)

		console.log(response)

		res.json({ status: 'ok' })
	} else {
		res.json({ status: "unauthorised" })
	}
})

app.post('/api/create', async (req, res) => {
	let isAuth = await authorise(req.query.user_ID)
	if (isAuth)  {
		const record = req.body
		console.log(record)

		// * CREATE (_C_RUD)
		const response = await Todo.create({...record, user_ID : req.query.user_ID}) //POST

		console.log(response)

		res.json({ status: 'ok' })
	} else {
		res.json({ status: "unauthorised" })
	}
})




app.listen(13371, '127.0.0.1', () => {
	console.log('Server up')
})
