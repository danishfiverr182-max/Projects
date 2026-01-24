const addProductBtn = document.getElementById("addProduct");
const productContainer = document.getElementById("productContainer");

addProductBtn.addEventListener("click", () => {

    const card = document.createElement("div");
    const img = document.createElement("img");
    const title = document.createElement("h3");
    const button = document.createElement("button");

    img.setAttribute("src", "woman-9443301_1280.jpg");
    img.setAttribute("alt", "Product Image");

    button.setAttribute("title", "Add to cart");

    // 3️⃣ ClassList Power
    card.classList.add("product-card");
    button.classList.add("btn-primary");

    // Content
    title.textContent = "Women Fashion";
    button.textContent = "Buy Now";

    // 4️⃣ Append Elements
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(button);
    productContainer.appendChild(card);

    // 5️⃣ Logic Task → Glow on Card Click
    card.addEventListener("click", () => {
        card.classList.toggle("glow");
    });

});
