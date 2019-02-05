'use strict()';

const list      = document.getElementById('todo-items');
const itemInput = document.getElementById('todo-add-new');
const toDoObjects = [];

let addToDo = function() {
  const todo = {
    text: itemInput.value,
    status: 'incomplete',
    id: generateId()
  };

  addToDoToDom(todo);
  addToDoToStorage(todo);
};

const addToDoToDom = function(todo) {
  let item        = document.createElement('li');
  let listLength  = list.children.length;
  let itemText    = '<label class="todo__text"><input type="checkbox" id="too-doo-check_' + todo.id + '"';
  if (todo.status === 'complete') {
    itemText += 'checked=checked';
  }
  itemText += '/><span class="px1">' + todo.text + '</span></label>';
  const itemAction  = '<span class="todo__remove"><button type="button" class="btn btn--icon" id="button-' + todo.id + '"><i class="icon icon--remove"></i></button></span>';

  item.innerHTML = itemText + itemAction;
  item.id = 'too-doo_' + (listLength + 1);
  item.classList.add('todo__item');
  item.setAttribute('data-status', todo.status);
  item.setAttribute('data-id', todo.id);
  list.appendChild(item);
  itemInput.value = '';
};

const addToDoToStorage = function(todo) {
  toDoObjects.push(todo);
  localStorage.setItem('toDoObjects', JSON.stringify(toDoObjects));
};

const loadToDosFromStorage = function() {
  const str = localStorage.getItem('toDoObjects');
  if (str) {
    toDoObjects = JSON.parse(str);
  }

  // construct dom html from toDoObjects
  for (let i=0; i<toDoObjects.length; i++) {
    addToDoToDom(toDoObjects[i]);
  }
};

const completeToDo = function(event) {
  const check = event.target;
  const toDo = check.closest('li');
  const toDoStatus = toDo.getAttribute('data-status');
  const toDoId = toDo.getAttribute('data-id');
   
  if (toDoStatus === 'incomplete') {
    toDoStatus = 'complete';
  } else {
    toDoStatus = 'incomplete';
  }

  toDo.setAttribute('data-status', toDoStatus);

  for (let i = 0; i < toDoObjects.length; i++) {
    if (toDoObjects[i].id === toDoId) {
      toDoObjects[i].status = toDoStatus;
    }
  }

  localStorage.setItem('toDoObjects', JSON.stringify(toDoObjects));
};

const removeToDo = function(event) {
  const button = event.target.closest('button');
  if(!button) {
    return false;
  }
  const toDo = button.closest('li');
  const toDoId = toDo.getAttribute('data-id');

  // 1. remove the list from the dom
  list.removeChild(toDo);
  // 2. remove the todo object with matching id from toDoObjects
  for (const i = 0; i < toDoObjects.length; i++) {
    if (toDoObjects[i].id === toDoId) {
      toDoObjects.splice(i, 1);
    }
  }
  // 3. set toDoObjects into localStorage as JSON
  localStorage.setItem('toDoObjects', JSON.stringify(toDoObjects));
};

let validateToDo = function(event) {
  event.preventDefault();
  if(!itemInput.value) {
    document.getElementById('error').innerHTML = 'Please enter a value!';
  } else {
    addToDo();
  }
};

const clearToDos = function(event) {
  event.preventDefault();
  window.localStorage.clear();
  location.reload();
  return false;
};

const generateId = function() {
  let charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let charSetSize = charSet.length;
  let charCount = 8;
  let id = '';
    for (let i = 1; i <= charCount; i++) {
        let randPos = Math.floor(Math.random() * charSetSize);
        id += charSet[randPos];
    }
    return id;
}

document.getElementById('clear-todos').addEventListener('click', clearToDos, false);

document.getElementById('btn-submit').addEventListener('click', validateToDo, false);

itemInput.onkeydown = function(event) {
  if(event.keyCode == 13) {
    validateToDo(event);
    return false;
  }
};

const toDoHandlers = function() {
  list.addEventListener('change', completeToDo, false);
  list.addEventListener('click', removeToDo, false);
};

window.onload = function(){
  toDoHandlers();
};

loadToDosFromStorage();