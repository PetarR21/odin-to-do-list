function getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

class ToDoItem {
    constructor(title, details, date, priority) {
        this.title = title;
        this.details = details;
        this.date = date;
        this.priority = priority;
        this.completed = false;
        this.id = 0;
    }
}

class ToDoList {
    constructor() {
        this.list = [];
        this.idCounter = 0;
    }

    addItem(item) {
        item.id = this.idCounter++;
        this.list.push(item);
    }

    removeItem(id) {
        this.list.forEach((item, index) => {
            if (item.id === id) {
                this.list.splice(index, 1);
            }
        })
    }

    getItem(index) {
        return this.list[index];
    }

    getList() {
        return this.list;
    }

    getElementByID(id) {
        let returnItem = null;
        this.list.forEach((item) => {
            if (item.id === id) {
                returnItem = item;
            }
        })

        return returnItem;
    }

    updateItem(id, title, details, date, priority) {
        this.list.forEach((item) => {
            if (item.id === id) {
                item.title = title;
                item.details = details;
                item.date = date;
                item.priority = priority;
            }
        })
    }

    toggleItem(id) {
        this.list.forEach((item) => {
            if (item.id === id) {
                if (item.completed === false) {
                    item.completed = true;
                } else {
                    item.completed = false;
                }
            }
        })
    }
}

class UI {
    static {
        this.list = new ToDoList();
    }

    static displayItems() {

        const StoredItems = [
            new ToDoItem('Item1', 'Details1', '2022-04-15', 'high'),
            new ToDoItem('Item2', 'Details3', '2022-06-09', 'low'),
        ]

        StoredItems.forEach(item => {
            UI.addItemToList(item);
        });
    }

    static createNewToDoElement(item) {
        console.log(item.completed);
        return `
        <div class="to-do-element-left">
            <input class="to-do-element-checkbox" type="checkbox" ${(item.completed===true)?("checked=true"):""}>
            <p class="to-do-element-title ${(item.completed===true)?("lineTrough opacity04"):""}">
                ${item.title}
            </p>
        </div>
        <div class="to-do-element-right">
            <button class="details ${(item.completed===true)?("opacity04"):""}">DETAILS</button>
            <p class="date ${(item.completed===true)?("opacity04"):""}">${item.date}</p>
            <i class="fa-solid fa-pen-to-square edit-btn ${(item.completed===true)?("opacity04"):""}" id="to-do-element-edit"></i>
            <i class="fa-solid fa-trash-can delete-btn ${(item.completed===true)?("opacity04"):""}"></i>
        </div>`
    }

    static addItemToList(item) {
        this.list.addItem(item);
        const content = document.querySelector('#content');
        const toDoElement = document.createElement('div');
        toDoElement.setAttribute('data-id', `${item.id}`);
        toDoElement.classList.add('to-do-element');
        

        if (item.priority === 'high') {
            toDoElement.classList.add('borderLeftRed');
        } else if (item.priority === 'mid') {
            toDoElement.classList.add('borderLeftOrange');
        } else {
            toDoElement.classList.add('borderLeftGreen');
        }
        toDoElement.innerHTML = this.createNewToDoElement(item);
        this.addEventListeners(toDoElement);
        content.appendChild(toDoElement);
    }

    static setDetails(element) {
        const item = this.list.getElementByID(parseInt(element.dataset.id));
        document.querySelector('.details-overlay-title .value').textContent = item.title;
        document.querySelector('.details-overlay-priority .value').textContent = item.priority;
        document.querySelector('.details-overlay-date .value').textContent = item.date;
        document.querySelector('.details-overlay-details .value').textContent = item.details;
    }

    static setEdit(element) {
        const item = this.list.getElementByID(parseInt(element.dataset.id));
        const editOverlay = document.querySelector('#edit-overlay');
        editOverlay.setAttribute('data-editId', element.dataset.id);
        const titleInput = editOverlay.querySelector('input[type="text"]');
        const detailsInput = editOverlay.querySelector('textarea');
        const dateInput = editOverlay.querySelector('input[type="date"]');
        const priorityInputs = editOverlay.querySelectorAll('input[name="edit-radio"]');

        titleInput.value = item.title;
        detailsInput.value = item.details;
        dateInput.value = item.date;

        if (item.priority === 'low') {
            priorityInputs[0].checked = true;
        } else if (item.priority === 'mid') {
            priorityInputs[1].checked = true;
        } else {
            priorityInputs[2].checked = true;
        }
    }

    static addEventListeners(element) {
        const deleteBtn = element.querySelector('.delete-btn');
        const detailsBtn = element.querySelector('.details')
        const editBtn = element.querySelector('.edit-btn')
        const checkButton = element.querySelector('.to-do-element-checkbox');
        
        deleteBtn.addEventListener('click', () => {
            this.list.removeItem(parseInt(element.dataset.id));
            element.remove();
        })

        detailsBtn.addEventListener('click', () => {
            this.setDetails(element);
            this.openDetails();
        })

        editBtn.addEventListener('click', () => {
            this.openEdit();
            this.setEdit(element);
        })

        checkButton.addEventListener('click', () => {
            this.list.toggleItem(parseInt(element.dataset.id));
            element.querySelector('.to-do-element-title').classList.toggle('lineTrough');
            element.querySelector('.to-do-element-title').classList.toggle('opacity04');
            element.querySelectorAll('.to-do-element-right > *').forEach(e => {
                e.classList.toggle('opacity04');
            })
        })

    }

    static openOverlay() {
        if (document.querySelector('#overlay').classList.contains('hidden')) {
            this.toggleBlur();
            this.toggleHidden(document.querySelector('#overlay'));
        }
    }

    static closeOverlay() {
        this.toggleBlur();
        this.toggleHidden(document.querySelector('#overlay'));
    }

    static toggleHidden(element) {
        element.classList.toggle('hidden');
    }

    static toggleBlur() {
        const header = document.querySelector('header');
        const sideBarAndMain = document.querySelector('#sidebar-main');
        header.classList.toggle('blur');
        sideBarAndMain.classList.toggle('blur');
    }

    static getFormValues() {
        return {
            title: document.querySelector('#overlay-to-do #title').value,
            details: document.querySelector('#overlay-to-do #details').value,
            date: document.querySelector('#overlay-to-do #date').value,
            priority: document.querySelector('#overlay-to-do input[type="radio"]:checked').value
        }
    }

    static clearFormValues() {
        document.querySelector('#overlay-to-do #title').value = "";
        document.querySelector('#overlay-to-do #details').value = "";
        document.querySelector('#overlay-to-do #date').value = "";
        document.querySelector('#overlay-to-do input[type="radio"]:checked').checked = false;
    }

    static toggleDetails() {
        document.querySelector('#details-overlay').classList.toggle('hidden');
    }

    static openDetails() {
        if (document.querySelector('#details-overlay').classList.contains('hidden')) {
            this.toggleBlur();
            this.toggleDetails();
        }
    }

    static closeDetails() {
        this.toggleBlur();
        this.toggleDetails();
    }

    static toggleEdit() {
        document.querySelector('#edit-overlay').classList.toggle('hidden');
    }

    static openEdit() {
        if (document.querySelector('#edit-overlay').classList.contains('hidden')) {
            this.toggleBlur();
            this.toggleEdit();
        }
    }

    static closeEdit() {
        this.toggleBlur();
        this.toggleEdit();
    }

    static updateElement(id, newTitle, newDetails, newDate, newPriority) {

        this.list.updateItem(id, newTitle, newDetails, newDate, newPriority);
        const element = document.querySelector(`[data-id="${id}"]`);

        element.querySelector('.to-do-element-title').textContent = newTitle;
        element.querySelector('.date').textContent = newDate;

        element.classList = "";
        element.classList.add('to-do-element');

        if (newPriority === 'high') {
            element.classList.add('borderLeftRed');
        } else if (newPriority === 'mid') {
            element.classList.add('borderLeftOrange');
        } else {
            element.classList.add('borderLeftGreen');
        }

    }
}

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayItems);

//Event: Open overlay form
document.querySelector('#add-btn').addEventListener('click', () => {
    UI.openOverlay();
});

//Event: Close overlay form
document.querySelector('#close-overlay-btn').addEventListener('click', () => {
    UI.closeOverlay();
})

//Event: Close details overlay
document.querySelector('#closeDetailsOverlay').addEventListener('click', () => {
    UI.closeDetails();
})

//Event: Close event overlay
document.querySelector('#edit-close-btn').addEventListener('click', () => {
    UI.closeEdit();
})

//Event: Click on confirm edit button
document.querySelector('#edit-overlay').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(e.target.dataset.editid);
    const title = document.querySelector('#edit-overlay input[type="text"]').value;
    const details = document.querySelector('#edit-overlay textarea').value;
    const date = document.querySelector('#edit-overlay input[type="date"]').value;
    const priority = document.querySelector('#edit-overlay input[type="radio"]:checked').dataset.value;

    UI.updateElement(id, title, details, date, priority);
    UI.closeEdit();
})

//Event: Submit overlay form and add item to list
document.querySelector('#overlay-to-do').addEventListener('submit', (e) => {
    e.preventDefault();

    const formValues = UI.getFormValues();
    const title = formValues.title;
    const details = formValues.details;
    const date = formValues.date;
    const priority = formValues.priority;

    UI.addItemToList(new ToDoItem(title, details, date, priority));
    UI.clearFormValues();
    UI.closeOverlay();
})