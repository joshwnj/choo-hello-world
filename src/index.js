const choo = require('choo')
const html = require('choo/html')
const devtools = require('choo-devtools')

var app = choo()
app.use(devtools())
app.use(store)
app.route('/', mainView)
app.mount('#root')

function mainView (state, emit) {
  const {
    editMode,
    name
  } = state

  const onEdit = () => emit('edit')

  const form = editMode
    ? html`<form onsubmit=${onSubmit}>
  hello <input value='${name}' oninput=${onInput} />
  <button type='submit'>Save</button>
</form>
`
   : html`<div>
  hello ${name}
  <button onclick=${onEdit}>Edit</button>
</div>
`
  
  return html`
  <div>
    ${form}
  </div>
`

  function onInput (e) {
    emit('input', 'name', e.target.value)
  }

  function onSubmit (e) {
    e.preventDefault()
    emit('save')
  }
}

function store (state, emitter) {
  state.name = 'world'
  state.editMode = false
  state.changes = {}

  emitter.on('edit', () => {
    state.editMode = true
    state.changes = {
      name: state.name
    }
    emitter.emit('render')
  })

  emitter.on('input', (key, value) => {
    state.changes[key] = value
  })

  emitter.on('save', () => {
    state.editMode = false
    state.name = state.changes.name
    emitter.emit('render')
  })
}
