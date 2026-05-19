const inventory = JSON.parse(localStorage.getItem("inventory")) || [];

const totalProducts = inventory.reduce((acc, product) => {
  return acc + product.quantity;
}, 0);

document.getElementById("total-products").textContent = totalProducts;

const totalValue = inventory.reduce((acc, product) => {
  return acc + (product.price * product.quantity);
}, 0);

document.getElementById("total-value").textContent = `₹ ${totalValue.toFixed(2)}`;

const lowStockProducts = inventory.filter((product) => product.quantity <= 2);

document.getElementById("low-stock").textContent = lowStockProducts.length;

const categories = [...new Set(inventory.map((product) => product.category))];

document.getElementById("categories").textContent = categories.length;
