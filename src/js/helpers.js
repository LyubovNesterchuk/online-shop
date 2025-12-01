// helpers.js
import { refs } from './refs.js';
import { fetchProducts, fetchProductsByCategory } from './products-api.js';
import { renderProducts } from './render-functions.js';
import iziToast from 'izitoast';
import Pagination from "tui-pagination";
import 'tui-pagination/dist/tui-pagination.css';

let currentPage = 1;
const limit = 12;
let currentCategory = "All";
let pagination = null;

export const resetPagination = (newCategory = "All") => {
  currentPage = 1;
  currentCategory = newCategory;
  refs.productsList.innerHTML = '';
  if (pagination) pagination.reset();
};

export const initPagination = (totalItems) => {
  if (pagination) {
    pagination.destroy();
    pagination = null;
  }

  pagination = new Pagination('pagination', {
    totalItems: totalItems,
    itemsPerPage: limit,
    visiblePages: 5,
    centerAlign: true,
  });

  pagination.on('afterMove', async (event) => {
    const page = event.page;
    await loadProductsByPage(page);
  });
};

export const loadProductsByPage = async (page) => {
  refs.loader.style.display = 'block';

  try {
    let products;
    if (currentCategory === "All") {
      products = await fetchProducts(page, limit);
    } else {
      products = await fetchProductsByCategory(currentCategory, page, limit);
    }

    if (products.length === 0) {
      iziToast.info({
        title: 'Info',
        message: 'No products found.',
        position: 'topRight'
      });
      refs.productsList.innerHTML = '';
    } else {
      renderProducts(products);
    }
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    refs.loader.style.display = 'none';
  }
};



export function changeTheme() {
  const themeToggle = refs.themeToggle;

  if (!themeToggle) {
    console.warn('Theme toggle button not found');
    return;
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(`${savedTheme}-theme`);

  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('light-theme')) {
      document.body.classList.replace('light-theme', 'dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.replace('dark-theme', 'light-theme');
      localStorage.setItem('theme', 'light');
    }
  });
}


