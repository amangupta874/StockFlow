// Fetch products from API //
const productsContainer = document.getElementById("products-container");

let allProducts = [];
let currentPage = 1;
const productsPerPage = 8;

async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();
    allProducts = products;
    displayProducts(products);
  } catch(error) {
    console.log("Error fetching products:", error);
  }
}
fetchProducts();

// Show products on screen //
function displayProducts(products) {
  productsContainer.innerHTML = "";
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginatedProducts = products.slice(start, end);

  paginatedProducts.map((product) => {
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
const searchInput = document.getElementById("search-input");
let timer;

searchInput.addEventListener("input", (e) => {

  clearTimeout(timer);
  timer = setTimeout(() => {
    const value = e.target.value.toLowerCase();
    const filteredProducts = allProducts.filter((product) => {
      return product.title.toLowerCase().includes(value);
    });

    displayProducts(filteredProducts);

  }, 500);
});

// Pagination + category filter //
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const pageNumber = document.getElementById("page-number");

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  if(currentPage < totalPages){
    currentPage++;
    pageNumber.textContent = currentPage;
    displayProducts(allProducts);
  }

});

prevBtn.addEventListener("click", () => {
  if(currentPage > 1){
    currentPage--;
    pageNumber.textContent = currentPage;
    displayProducts(allProducts);
  }
});

const categoryFilter = document.getElementById("category-filter");
categoryFilter.addEventListener("change", (e) => {
  const value = e.target.value;
  if(value === "all"){
    displayProducts(allProducts);
    return;
  }

  const filteredProducts =
    allProducts.filter((product) => {
      return product.category === value;
    });
  displayProducts(filteredProducts);
});


