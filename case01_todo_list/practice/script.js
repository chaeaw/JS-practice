;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  const API_URL = 'http://localhost:3000/todos'

  const $todos = get('.todos')
  const $form = get('.todo_form')
  const $todoInput = get('.todo_input')

  const createTodoElement = (item) => {
    const { id, content, completed } = item
    const $todoItem = document.createElement('div')
    const isChecked = completed ? 'checked' : ''
    $todoItem.classList.add('item')
    $todoItem.dataset.id = id
    // "item" 클래스와 todo의 id를 data-id로 가지는 div안에 아래의 내용이 들어간 html이 생성됨.
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox' ${isChecked}
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item_buttons content_buttons">
              <button class="todo_edit_button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo_remove_button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item_buttons edit_buttons">
              <button class="todo_edit_confirm_button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo_edit_cancel_button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `
    return $todoItem
  }

  const renderAllTodos = (todos) => {
    $todos.innerHTML = '' // 초기화

    todos.forEach((todo) => {
      const todoElement = createTodoElement(todo)
      $todos.appendChild(todoElement)
    })
  }

  const getTodos = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((todos) => renderAllTodos(todos))
      .catch((error) => console.log(error))
  }

  const addTodo = (e) => {
    e.preventDefault() // submit 클릭 시 새로고침 방지
    const todo = {
      content: $todoInput.value,
      completed: false,
    }
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    })
      .then(getTodos)
      .then(() => {
        $todoInput.value = ''
        $todoInput.focus()
      })
      .catch((error) => console.log(error))
  }

  const toggleTodo = (e) => {
    if (e.target.className !== 'todo_checkbox') return
    const $item = e.target.closest('.item')
    const id = $item.dataset.id
    const completed = e.target.checked

    fetch(`${API_URL}/${id}`, {
      method: 'PATCH', // PUT은 전체 수정(업데이트), PATCH는 일부분 수정
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    })
      .then(getTodos)
      .catch((error) => console.log(error))
  }

  const changeEditMode = (e) => {
    const $item = e.target.closest('.item')
    const $label = $item.querySelector('label')
    const $editInput = $item.querySelector(`input[type="text"]`)
    const $contentButtons = $item.querySelector('.content_buttons')
    const $EditButtons = $item.querySelector('.edit_buttons')
    const value = $editInput.value

    if (e.target.className === 'todo_edit_button') {
      $label.style.display = 'none'
      $editInput.style.display = 'block'
      $contentButtons.style.display = 'none'
      $EditButtons.style.display = 'block'

      $editInput.focus()
      $editInput.value = ''
      $editInput.value = value
    }

    if (e.target.className === 'todo_edit_cancel_button') {
      $label.style.display = 'block'
      $editInput.style.display = 'none'
      $contentButtons.style.display = 'block'
      $EditButtons.style.display = 'none'

      $editInput.value = $label.innerText
    }
  }

  const editTodo = (e) => {
    if (e.target.className !== 'todo_edit_confirm_button') return

    const $item = e.target.closest('.item')
    const id = $item.dataset.id
    const $editInput = $item.querySelector(`input[type="text"]`)
    const content = $editInput.value

    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
      .then(getTodos)
      .catch((error) => console.log(error))
  }

  const removeTodo = (e) => {
    if (e.target.className !== 'todo_remove_button') return

    const $item = e.target.closest('.item')
    const id = $item.dataset.id

    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
      .then(getTodos)
      .catch((error) => console.log(error))
  }
  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getTodos()
    })
    $form.addEventListener('submit', addTodo)
    $todos.addEventListener('click', toggleTodo)
    $todos.addEventListener('click', changeEditMode)
    $todos.addEventListener('click', editTodo)
    $todos.addEventListener('click', removeTodo)
  }
  init()
})()
