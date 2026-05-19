// Fetch products from API //
const productsContainer = document.getElementById("products-container");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const pageNumber = document.getElementById("page-number");

let allProducts = [];
let visibleProducts = [];
let currentPage = 1;
const productsPerPage = 8;

async function fetchProducts() {
  try {
    productsContainer.innerHTML = `<p class="status-message">Loading products...</p>`;
    const response = await fetch("https://fakestoreapi.com/products");

    if(!response.ok){
      throw new Error("Unable to fetch products");
    }

    const products = await response.json();
    allProducts = products;
    visibleProducts = products;
    displayProducts();
  } catch(error) {
    console.log("Error fetching products:", error);
    productsContainer.innerHTML = `<p class="status-message">Products could not be loaded. Please try again later.</p>`;
  }
}
fetchProducts();

// Show products on screen //
function displayProducts() {
  productsContainer.innerHTML = "";
  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / productsPerPage));

  if(currentPage > totalPages){
    currentPage = totalPages;
  }

  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginatedProducts = visibleProducts.slice(start, end);

  pageNumber.textContent = currentPage;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  if(visibleProducts.length === 0){
    productsContainer.innerHTML = `<p class="status-message">No matching products found.</p>`;
    return;
  }

  paginatedProducts.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>₹ ${product.price}</p>
      <button class="add-btn">Add To Inventory</button>`;

    const button = card.querySelector(".add-btn");
    button.addEventListener("click", () => {
      addToInventory(product);
    });

    productsContainer.append(card);
  });
}

// Add products to inventory //
function addToInventory(product){
  let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

  const exists = inventory.find((item) => item.id === product.id);

  if(exists){
    exists.quantity += 1;
  } else {
    inventory.push({...product,quantity: 1});
  }

  localStorage.setItem("inventory",JSON.stringify(inventory));
  alert("Product added to inventory");
}

// Search products //
let timer;

function applyProductFilters(){
  const searchValue = searchInput.value.trim().toLowerCase();
  const categoryValue = categoryFilter.value;

  visibleProducts = allProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchValue);
    const matchesCategory = categoryValue === "all" || product.category === categoryValue;

    return matchesSearch && matchesCategory;
  });

  currentPage = 1;
  displayProducts();
}

searchInput.addEventListener("input", () => {

  clearTimeout(timer);
  timer = setTimeout(() => {
    applyProductFilters();

  }, 500);
});

// Pagination + category filter //
nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(visibleProducts.length / productsPerPage);

  if(currentPage < totalPages){
    currentPage++;
    displayProducts();
  }

});

prevBtn.addEventListener("click", () => {
  if(currentPage > 1){
    currentPage--;
    displayProducts();
  }
});

categoryFilter.addEventListener("change", applyProductFilters);

