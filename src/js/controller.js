import * as model from './model.js';
import { MODAL_CLOSE_SECONDS } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
////////////////////////////////////////////////////
import 'core-js/stable';
import 'regenerator-runtime/runtime';
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// MVC in work lol
const loadRecipeController = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Ask to render spinner VIEW
    recipeView.renderSpinner();

    // select recipe from pagination
    resultsView.update(model.generateResultsPage(1));

    // Load recipe MODEL
    await model.loadRecipe(id);

    // Render recipe VIEW
    recipeView.render(model.state.recipe);

    bookmarkView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const searchRecipeController = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    //  ask Model to make AJAX call
    await model.loadSearchResults(query);

    // Show results
    resultsView.render(model.generateResultsPage(1));

    paginationView.render(model.state.search);
  } catch (err) {}
};

const paginationFunction = function (page) {
  model.state.search.page = Number(page);
  resultsView.render(model.generateResultsPage());
  paginationView.render(model.state.search);
};

const updateServingsFunction = function (n) {
  model.updateServings(n);
  recipeView.update(model.state.recipe);
};

const Bookmark = function () {
  // Handle bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const bookmarkRender = function () {
  bookmarkView.render(model.state.bookmarks);
};

const addRecipeFunction = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarkView.render(model.state.bookmarks);

    // Change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

// init function
(function () {
  bookmarkView.addHandlerRender(bookmarkRender);
  recipeView.addHandlerRender(loadRecipeController);
  recipeView.addHandlerUpdateServings(updateServingsFunction);
  recipeView.addHandlerBookmark(Bookmark);
  searchView.addHandlerRender(searchRecipeController);
  paginationView.addHandlerClick(paginationFunction);
  addRecipeView.addHandlerUpload(addRecipeFunction);
})();
