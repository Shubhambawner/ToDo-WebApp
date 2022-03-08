const addButton = document.querySelector('.addButton')
var input = document.querySelector('.input')
const container = document.querySelector('.container')

class item {
	constructor(record) {
		this.createDiv(record)
	}
	createDiv(record) {
		let input = document.createElement('input')
		input.value = record.record
		input.disabled = true
		input.classList.add('item_input')
		input.type = 'text'

		let itemBox = document.createElement('div')
		itemBox.classList.add('item')

		let editButton = document.createElement('button')
		editButton.innerHTML = 'EDIT'
		editButton.classList.add('editButton')

		let radioButton = document.createElement('button')
		radioButton.innerHTML = record.complete ? "done" : "left"
		radioButton.classList.add('radioButton')
		radioButton.classList.add((record.complete) ? 'green' : 'red')

		let dropdown = document.createElement('div')
		dropdown.innerHTML = 
		`<select id = "${record.record}" >  <option hidden="">${record.priority}</option> <option> High </option>  <option> Medium </option>  <option> Low </option>  <option> urgent </option>  </select > `
		console.log(record)
		

		let removeButton = document.createElement('button')
		removeButton.innerHTML = 'REMOVE'
		removeButton.classList.add('removeButton')

		container.appendChild(itemBox)

		itemBox.appendChild(input)
		itemBox.appendChild(dropdown)
		itemBox.appendChild(radioButton)
		itemBox.appendChild(editButton)
		itemBox.appendChild(removeButton)

		editButton.addEventListener('click', () => this.edit(input))
		radioButton.addEventListener('click', () => this.editRadio(radioButton, input))
		removeButton.addEventListener('click', () => this.remove(itemBox, input.value))
		dropdown.firstChild.addEventListener('click', () => this.favTutorial(record))
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
	async editRadio(radioButton, input) {
		const user_ID = localStorage.getItem(`user_ID`);
		let complete = !(radioButton.innerHTML == "done")
		await fetch(`/api/modify?user_ID=${user_ID}`, {
			method: 'POST',
			body: JSON.stringify({ old: input.value, complete: complete }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		radioButton.innerHTML = (radioButton.innerHTML == "done") ? 'left' : 'done'
		radioButton.classList.toggle('green')
		radioButton.classList.toggle('red')
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

	async favTutorial(record) {
		var mylist = document.getElementById(record.record);
		const user_ID = localStorage.getItem(`user_ID`)
		await fetch(`/api/modify?user_ID=${user_ID}`, {
			method: 'POST',
			body: JSON.stringify({ old: record.record, priority	: mylist.options[mylist.selectedIndex].text }),
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
		}).then(() => { window.location.reload() })

		input.value = ''
	}
}


async function boot() {
	let user_ID = localStorage.getItem("user_ID")
	const records = await fetch(`/api/get?user_ID=${user_ID}`).then((t) => t.json())
	records.forEach((record) => {
		new item(record)
	})
	if (user_ID) {
		let logoutButton = document.createElement('button')
		logoutButton.innerHTML = 'log out'
		logoutButton.classList.add('logoutButton')
		logoutButton.addEventListener('click', () => {
			localStorage.clear();
			window.location.href = window.location.origin;
		})
		container.appendChild(logoutButton)
	} else {
		let loginButton = document.createElement('button')
		loginButton.innerHTML = 'log in'
		loginButton.classList.add('loginButton')
		loginButton.addEventListener('click', () => {
			window.location.href = window.location.origin;
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
