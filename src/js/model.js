import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
    recipes: [],
  },
  bookmarks: [],
};

const getRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    let data = await getJSON(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = getRecipeObject(data);
    if (state.bookmarks.some(recipe => recipe.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    let data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    const { recipes } = data.data;
    state.search.recipes = recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const generateResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.recipes.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= newServings / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const maintainBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  maintainBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (state.recipe.id === id) state.recipe.bookmarked = false;
  maintainBookmarks();
};

export const uploadRecipe = async function (recipe) {
  try {
    const ingredients = Object.entries(recipe)
      .filter(data => data[0].startsWith('ingredient') && data[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(ing => ing.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use correct format :)'
          );
        const [quantity, unit, description] = ingArr;

        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });

    const RECIPE = {
      title: recipe.title,
      source_url: recipe.sourceUrl,
      image_url: recipe.image,
      publisher: recipe.publisher,
      cooking_time: +recipe.cookingTime,
      servings: +recipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, RECIPE);

    state.recipe = getRecipeObject(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

(function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
})();

// (function () {
//   localStorage.clear('bookmarks');
// })();
