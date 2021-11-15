import View from './view.js';
import icons from 'url:../../img/icons.svg';

class bookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  addHandlerRender(handler) {
    window.addEventListener('load', function () {
      handler();
    });
  }

  _generateHtml() {
    const id = window.location.hash.slice(1);
    return this._data.reduce((acc, recipe) => {
      let html = `
          <li class="preview">
            <a class="preview__link ${
              recipe.id === id ? 'preview__link--active' : ''
            } " href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
              
              <div class="recipe__user-generated ${recipe.key ? '' : 'hidden'}">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>  
            
              </div>
          </a>
        </li>
      `;
      return (acc += html);
    }, '');
  }
}

export default new bookmarkView();
