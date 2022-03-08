const addButton = document.querySelector('.addButton')
var input = document.querySelector('.input')
const container = document.querySelector('.container')

class item {
	constructor(itemName) {
		this.createDiv(itemName)
	}
	createDiv(itemName) {
		let input = document.createElement('input')
		input.value = itemName
		input.disabled = true
		input.classList.add('item_input')
		input.type = 'text'

		let itemBox = document.createElement('div')
		itemBox.classList.add('item')

		let editButton = document.createElement('button')
		editButton.innerHTML = 'EDIT'
		editButton.classList.add('editButton')

		let removeButton = document.createElement('button')
		removeButton.innerHTML = 'REMOVE'
		removeButton.classList.add('removeButton')

		container.appendChild(itemBox)

		itemBox.appendChild(input)
		itemBox.appendChild(editButton)
		itemBox.appendChild(removeButton)

		editButton.addEventListener('click', () => this.edit(input))

		removeButton.addEventListener('click', () => this.remove(itemBox, input.value))
	}

	async edit(input) {
		const newInput = window.prompt('Enter new msg:')
		const user_ID = localStorage.getItem(`user_ID`)
		await fetch(`/api/modify?user_ID=${user_ID}`, {
			method: 'POST',
			body: JSON.stringify({ old: input.value, new: newInput }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		input.value = newInput
	}

	async remove(item, value) {
		container.removeChild(item)
		let user_ID = localStorage.getItem("user_ID")
		await fetch(`/api/delete?user_ID=${user_ID}`, {
			method: 'POST',
			body: JSON.stringify({ record: value }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}
}

async function check() {
	if (input.value != '') {
		new item(input.value)

		let user_ID = localStorage.getItem("user_ID")

		await fetch(`/api/create?user_ID=${user_ID}`, {
			method: 'POST',
			body: JSON.stringify({ record: input.value }),
			headers: {
				'Content-Type': 'application/json'
			}
		})

		input.value = ''
	}
}

async function boot() {
	let user_ID = localStorage.getItem("user_ID")
	const records = await fetch(`/api/get?user_ID=${user_ID}`).then((t) => t.json())
	records.forEach(({ record }) => {
		new item(record)
	})
	if (user_ID) {
		let logoutButton = document.createElement('button')
		logoutButton.innerHTML = 'log out'
		logoutButton.classList.add('logoutButton')
		logoutButton.addEventListener('click', () => {
			localStorage.clear();
			window.location.href  = window.location.origin;
		})
		container.appendChild(logoutButton)
	}else{
		let loginButton = document.createElement('button')
		loginButton.innerHTML = 'log in'
		loginButton.classList.add('loginButton')
		loginButton.addEventListener('click', () => {
			window.location.href  = window.location.origin;
		})
		container.appendChild(loginButton)
	}
}

boot()

addButton.addEventListener('click', check)

window.addEventListener('keydown', (e) => {
	if (e.which == 13) {
		check()
	}
})
