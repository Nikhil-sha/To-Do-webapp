// Element Selectors
const mainMenu = document.getElementById("main-menu");
const mainMenuTogglers = document.querySelectorAll('.menu-toggle');
const notificationContainer = document.getElementById("notification-container");
const newTaskPopup = document.getElementById("new-task-popup");
const newTaskPopupTogglers = document.querySelectorAll('.toggle-new-task-popup');
const editTaskPopup = document.getElementById("edit-task-popup");
const githubRepoLink = document.getElementById("github-repo-link");
const githubRepoLinkToggler = document.querySelector('.github-repo-link');
const addTaskBtn = document.getElementById("add-task-button");
const deleteAllTasksBtn = document.getElementById("delete-all-tasks");
const taskInput = document.getElementById('new-task-input');
const editTaskInput = document.getElementById('edit-task-input');
const taskList = document.getElementById('task-list');
let currentTaskName = ''; // Track the task currently being edited

// Color Array
const colorArray = [
    "bg-blue-300", "bg-green-300", "bg-red-300", "bg-yellow-300",
    "bg-purple-300", "bg-pink-300", "bg-gray-300", "bg-teal-300",
    "bg-indigo-300", "bg-orange-300"
];

// Utility Functions
function redirect(url) {
	window.location.href = url;
	showNotification('link', `Redirecting to ${url}`, colorArray[7]);
}

function toggleVisibility(element) {
	element.classList.toggle("hidden");
}

function showNotification(icon, message, bgColor) {
	const notification = document.createElement('div');
	notification.classList.add('w-fit', 'p-2', bgColor, 'rounded-xl', 'shadow-xl', 'flex', 'justify-center', 'items-center', 'gap-1');
	notification.innerHTML = `<span class="material-symbols-rounded">${icon}</span><span class="font-bold">${message}</span>`;

	notificationContainer.prepend(notification);
	setTimeout(() => notification.remove(), 6000);
}

function applyRandomBgColors() {
	document.querySelectorAll('.bg-random').forEach(element => {
		const randomColor = colorArray[Math.floor(Math.random() * colorArray.length)];
		element.classList.remove("bg-random");
		element.classList.add(randomColor);
	});
}

function applyRandomHoverColors() {
	document.querySelectorAll('.hover-random').forEach(element => {
		const randomColor = "hover:" + colorArray[Math.floor(Math.random() * colorArray.length)];
		element.classList.remove("hover-random");
		element.classList.add(randomColor);
	});
}

function refreshTasks() {
	loadTasks();
	applyRandomBgColors();
}

// Task Functions
function createTask(taskName) {
	if (!taskName) {
		showNotification('warning', "Task name cannot be empty.", colorArray[3]);
		return;
	}

	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

	if (tasks.includes(taskName)) {
		showNotification('warning', `Task "${taskName}" already exists.`, colorArray[3]);
		return;
	}

	tasks.push(taskName);
	localStorage.setItem('tasks', JSON.stringify(tasks));
	showNotification('check', `Task "${taskName}" added.`, colorArray[1]);
	taskInput.value = "";
	refreshTasks();
	toggleVisibility(newTaskPopup);
}

function updateTask(oldTaskName, newTaskName) {
	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

	if (!tasks.includes(oldTaskName)) {
		showNotification('error', `Task "${oldTaskName}" not found.`, colorArray[2]);
		toggleVisibility(editTaskPopup);
		return;
	}

	const updatedTasks = tasks.map(task => task === oldTaskName ? newTaskName : task);
	localStorage.setItem('tasks', JSON.stringify(updatedTasks));
	showNotification('check', `Task "${oldTaskName}" updated to "${newTaskName}".`, colorArray[1]);
	refreshTasks();
	toggleVisibility(editTaskPopup);
}

function deleteTask(taskName) {
	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

	if (!tasks.includes(taskName)) {
		showNotification('error', `Task "${taskName}" not found.`, colorArray[2]);
		return;
	}

	const updatedTasks = tasks.filter(task => task !== taskName);
	localStorage.setItem('tasks', JSON.stringify(updatedTasks));
	showNotification('check', `Task "${taskName}" deleted.`, colorArray[1]);
	refreshTasks();
}

function clearAllTasks() {
	localStorage.removeItem('tasks');
	showNotification('delete', "All tasks have been deleted.", colorArray[2]);
	refreshTasks();
}

function loadTasks() {
	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
	taskList.innerHTML = '';

	tasks.forEach(task => {
		const taskItem = document.createElement('li');
		taskItem.classList.add('w-36', 'h-44', 'py-2', 'px-3', 'relative', 'rounded-xl', 'shadow-xl', 'bg-random');

		const taskTitle = document.createElement('span');
		taskTitle.textContent = task;
		taskTitle.classList.add('text-xl', 'font-bold', 'mb-2');

		const deleteButton = document.createElement('button');
		deleteButton.classList.add('material-symbols-rounded', 'text-base', 'shadow-inner', 'text-gray-500', 'bg-white', 'py-1', 'px-2', 'mr-1', 'rounded-xl');
		deleteButton.textContent = 'delete';
		deleteButton.onclick = () => deleteTask(task);

		const editButton = document.createElement('button');
		editButton.classList.add('material-symbols-rounded', 'text-base', 'shadow-inner', 'text-gray-500', 'bg-white', 'py-1', 'px-2', 'rounded-xl');
		editButton.textContent = 'edit';
		editButton.onclick = () => {
			currentTaskName = task; // Store the task name being edited
			editTaskInput.value = task; // Set task to edit in the input field
			toggleVisibility(editTaskPopup);
		};

		const actionButtonsDiv = document.createElement('div');
		actionButtonsDiv.classList.add('absolute', 'bottom-2', 'left-2');
		actionButtonsDiv.appendChild(deleteButton);
		actionButtonsDiv.appendChild(editButton);

		taskItem.appendChild(taskTitle);
		taskItem.appendChild(actionButtonsDiv);
		taskList.prepend(taskItem);
	});
}

// Event Listeners
mainMenuTogglers.forEach(element => element.addEventListener('click', () => toggleVisibility(mainMenu)));
newTaskPopupTogglers.forEach(element => element.addEventListener('click', () => toggleVisibility(newTaskPopup)));
githubRepoLinkToggler.addEventListener('click', () => toggleVisibility(githubRepoLink));
addTaskBtn.addEventListener('click', () => createTask(taskInput.value.trim()));
deleteAllTasksBtn.addEventListener('click', clearAllTasks);

// Redirects
document.getElementById("github-repo-link").addEventListener('click', () => redirect('https://github.com/Nikhil-sha/To-Do-webapp'));
document.querySelector(".view-other-projects").addEventListener('click', () => redirect('https://github.com/Nikhil-sha'));
document.querySelector(".about-author").addEventListener('click', () => redirect('https://nikhil-sha.blogspot.com/p/about.html'));
document.querySelector(".get-help").addEventListener('click', () => redirect('https://nikhil-sha.blogspot.com/p/contact.html'));

// Edit Task Popup Logic
document.getElementById('save-edited-task-button').addEventListener('click', () => {
	const newTaskName = editTaskInput.value.trim();
	if (currentTaskName && newTaskName) {
		updateTask(currentTaskName, newTaskName);
	}
	currentTaskName = ''; // Reset current task name after editing
});

// Initial Actions
loadTasks();
applyRandomBgColors();
applyRandomHoverColors();
