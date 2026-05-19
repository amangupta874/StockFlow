const inventoryContainer =
  document.getElementById("inventory-container");

let inventory =
  JSON.parse(localStorage.getItem("inventory")) || [];

function displayInventory(){

  inventoryContainer.innerHTML = "";

if(inventory.length === 0){

  inventoryContainer.innerHTML = `

      <div class="empty-state">

        <h2>
          📦 Inventory Empty
        </h2>

        <p>
          No products added yet.
          Start adding products to manage inventory.
        </p>

        <a href="products.html">

          <button>
            Browse Products
          </button>

        </a>

      </div>

    `;

    return;
  }

  inventory.map((product) => {

    const card = document.createElement("div");

    card.classList.add("product-card");

    if(product.quantity <= 2){
      card.classList.add("low-stock");
    }

    const totalPrice =
      (product.price * product.quantity).toFixed(2);

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />

      <h3>${product.title}</h3>

      <p>Price: ₹ ${product.price}</p>

      <p>Quantity: ${product.quantity}</p>

      ${product.quantity <= 2 ? `<p class="warning-text"> Low Stock </p>`: ""}

      <p>Total: ₹ ${totalPrice}</p>

      <div class="inventory-buttons">

        <button class="decrease-btn">
          -
        </button>

        <button class="increase-btn">
          +
        </button>

        <button class="remove-btn">
          Remove
        </button>

      </div>
    `;

    const increaseBtn =
      card.querySelector(".increase-btn");

    const decreaseBtn =
      card.querySelector(".decrease-btn");

    const removeBtn =
      card.querySelector(".remove-btn");

    increaseBtn.addEventListener("click", () => {

      increaseQuantity(product.id);

    });

    decreaseBtn.addEventListener("click", () => {

      decreaseQuantity(product.id);

    });

    removeBtn.addEventListener("click", () => {

      removeProduct(product.id);

    });

    inventoryContainer.append(card);

  });

}

function removeProduct(id){

  inventory = inventory.filter(
    (product) => product.id !== id
  );

  localStorage.setItem(
    "inventory",
    JSON.stringify(inventory)
  );

  displayInventory();

}

displayInventory();

function increaseQuantity(id){

  const product =
    inventory.find((item) => item.id === id);

  product.quantity += 1;

  localStorage.setItem(
    "inventory",
    JSON.stringify(inventory)
  );

  displayInventory();

}

function decreaseQuantity(id){

  const product =
    inventory.find((item) => item.id === id);

  if(product.quantity > 1){

    product.quantity -= 1;

  }

  localStorage.setItem(
    "inventory",
    JSON.stringify(inventory)
  );

  displayInventory();

}
