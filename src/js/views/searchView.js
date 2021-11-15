class SearchView {
  _parentEl = document.querySelector('.search');
  getQuery() {
    const input = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return input;
  }
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  addHandlerRender(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
