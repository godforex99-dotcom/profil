 
const buttons = document.querySelectorAll(".addToCart");
const cartCount = document.querySelector("#cartCount");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const clearCartButton = document.querySelector("#clearCart");

let cart = JSON.parse(localStorage.getItem("gdowinCart")) || [];

function saveCart() {
    localStorage.setItem("gdowinCart", JSON.stringify(cart));
}

function updateCartCount() {
    if (cartCount) {
        cartCount.textContent = cart.reduce(
            (total, item) => total + item.quantity, 0
        );
    }
}

buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        const image = button.dataset.image;

        const existingItem = cart.find(item =>
            item.name === name && item.price === price
        );

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }

        saveCart();
        updateCartCount();

        alert(name + " added to cart!");
    });
});

function displayCart() {
    if (!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(function(item, index) {
        const product = document.createElement("div");
        const image = document.createElement("img");
        const name = document.createElement("h3");
        const price = document.createElement("p");
        const quantity = document.createElement("p");
        const removeButton = document.createElement("button");

        image.src = item.image || "";
        image.alt = item.name;
        image.style.width = "120px";
        image.style.height = "120px";
        image.style.objectFit = "contain";

        name.textContent = item.name;
        price.textContent =
            "Price: ₦" + item.price.toLocaleString("en-NG");
        quantity.textContent = "Quantity: " + item.quantity;
        removeButton.textContent = "Remove";

        total += item.price * item.quantity;

        product.append(image, name, price, quantity, removeButton);
        cartItems.appendChild(product);

        removeButton.addEventListener("click", function() {
            cart.splice(index, 1);
            saveCart();
            displayCart();
            updateCartCount();
        });
    });

    if (cartTotal) {
        cartTotal.textContent =
            "Total: ₦" + total.toLocaleString("en-NG");
    }
}

if (clearCartButton) {
    clearCartButton.addEventListener("click", function() {
        cart = [];
        saveCart();
        displayCart();
        updateCartCount();
    });
}

updateCartCount();
displayCart();

const whatsappButton = document.querySelector("#whatsappCheckout");

if (whatsappButton) {
    whatsappButton.addEventListener("click", function() {

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const sellerNumber = "2349126178626";

        let message = "Hello GDOWIN'S TECH! I want to order:\n\n";

        let total = 0;

        cart.forEach(function(item) {
            const itemTotal = item.price * item.quantity;

            message +=
                item.name + "\n" +
                "Quantity: " + item.quantity + "\n" +
                "Price: ₦" + item.price.toLocaleString("en-NG") + "\n" +
                "Subtotal: ₦" + itemTotal.toLocaleString("en-NG") +
                "\n\n";

            total += itemTotal;
        });

        message +=
            "Total: ₦" + total.toLocaleString("en-NG") +
            "\n\nPlease tell me how to make payment.";

        const whatsappLink =
            "https://wa.me/" + sellerNumber +
            "?text=" + encodeURIComponent(message);

        window.open(whatsappLink, "_blank");
    });
}

