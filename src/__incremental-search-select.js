const css = new CSSStyleSheet()
css.replace(`
@import './src/incremental-search-select.css';
`)

class __incrementalSearchSelect extends HTMLElement {
  static formAssociated = true

  constructor() {
    super()
    this._internals = this.attachInternals()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.adoptedStyleSheets = [css]

    this._input = document.createElement('input')
    this._options = []
    this._selectBox = document.createElement('ul')
    this._list = []
    this._focusedIndex = 0

    this.setGlobalEvent()
  }

  connectedCallback() {
    this.render()
    this.buildSelectBox()
  }

  render() {
    this._input.name = this.inputName
    this._input.addEventListener('change', () => { this.setFormValue() })
    this._input.addEventListener('focus', () => { this.showSelectBox() })
    this._input.addEventListener('keydown', () => { this.incrementalSearch() })
    this.shadowRoot.appendChild(this._input)
  }

  get value() { return this._input.value }
  set value(v) { this._input.value = v }

  get inputName() {
    return this.getAttribute('name')
  }

  setOptionList() {
    this.querySelectorAll('option').forEach(option => {
      this._options.push({
        value: option.value,
        label: option.innerText,
        suggestions: option.dataset.suggestions
      })
    })
  }

  buildSelectBox() {
    this.setOptionList()

    this._options.forEach((option, index) => {
    // this.filteredOption.forEach((option, index) => {
      const li = document.createElement('li')
      li.dataset.index = index
      li.dataset.value = option.value
      li.innerText = option.label
      li.tabIndex = index + 1
      li.addEventListener('focus', (e) => this.focusedItem(e))
      li.addEventListener('keydown', (e) => this.selectedItemByEnter(e))
      li.addEventListener('click', (e) => this.clickedItem(e))
      this._list.push(li)
      this._selectBox.appendChild(li)
    })
    this.shadowRoot.appendChild(this._selectBox)
  }

  showSelectBox() {
    this._selectBox.classList.add('show')
  }

  hideSelectBox() {
    this._selectBox.classList.remove('show')
  }

  incrementalSearch() {
    const keyword = this._input.value

  }

  filteredOption() {
    return this._options.filter(o => o.suggestions.includes(this._input.value))
  }

  setGlobalEvent() {
    this._input.addEventListener('keydown', e => {
      if (e.keyCode == 38) {
        this._list[this._list.length - 1].focus()
      }
      if (e.keyCode == 40) {
        this._list[0].focus()
      }
    })
    this._selectBox.addEventListener('keydown', e => {
      if (e.keyCode == 38) {
        const prev = (this._focusedIndex == 0) ? this._list.length - 1 : this._focusedIndex - 1
        this._list[prev].focus()
      }
      if (e.keyCode == 40) {
        const next = (this._focusedIndex + 1 == this._list.length) ? 0 : this._focusedIndex + 1
        this._list[next].focus()
      }
    })
  }

  focusedItem(e) {
    this._focusedIndex = parseInt(e.target.dataset.index)
  }

  selectedItemByEnter(e) {
    if (e.keyCode === 13) {
      this._input.value = e.target.dataset.value
    }
  }

  clickedItem(e) {
    this._input.value = e.target.dataset.value
  }

  setFormValue() {
    this._internals.setFormValue(this.value)
  }
}


customElements.define('incremental-search-select', IncrementalSearchSelect)
