const addBtn = document.querySelector('#add-btn');
const overlay = document.querySelector('#overlay');
const header = document.querySelector('header');
const sidebarMain = document.querySelector('#sidebar-main');
const closeOverlayButton = document.querySelector('#close-overlay-btn');
const toDoForm = document.querySelector('#overlay-to-do');
const addToDoButton = toDoForm.querySelector('input[type="submit"]');

//ToDoList class
class ToDoElement {
    constructor(title, details, date, priority) {
        this.title = title;
        this.details = details;
        this.date = date;
        this.priority = priority;
    }
}

class ToDoList {
    constructor() {
        this.list = [];
    }

    getList() {
        return this.list;
    }

    addElement(element) {
        this.list.push(element);
    }
}

//UI class: Handles UI tasks
class UI {
    static setBlur = () => {
        header.classList.add('blur');
        sidebarMain.classList.add('blur');
    }

    static removeBlur = () => {
        header.classList.remove('blur');
        sidebarMain.classList.remove('blur');
    }

    static openOverlay = () => {
        overlay.classList.add('openAnimationClass');
        setTimeout(() => {
            overlay.classList.remove('hidden');
            this.setBlur();
            overlay.classList.remove('openAnimationClass');
        }, 100);
    }

    static closeOverlay = () => {
        overlay.classList.add('closeAnimationClass');
        setTimeout(() => {
            overlay.classList.add('hidden');
            this.removeBlur();
            overlay.classList.remove('closeAnimationClass');
        }, 100);
    }

    static clearInput = () => {
        document.querySelectorAll('.clear').forEach(element => {
            element.value = "";
        })
        document.querySelector('input[name="radio-group"]:checked').checked = false;
    }


}

//Initialize a new ToDoList
toDoList = new ToDoList();

//Event: Click on add button
addBtn.addEventListener('click', () => {
    UI.openOverlay();
})

//Event: Click on overlay close button
closeOverlayButton.addEventListener('click', () => {
    UI.closeOverlay();
})

//Event: Click on add to do button
toDoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = toDoForm.querySelector('#title').value;
    const details = toDoForm.querySelector('#details').value;
    const date = toDoForm.querySelector('#date').value;
    const priority = toDoForm.querySelector('input[name="radio-group"]:checked').value;

    toDoList.addElement(new ToDoElement(title, details, date, priority));
    console.log(toDoList.getList());
    UI.clearInput();
    UI.closeOverlay();
})