// -------------------- إضافة منتج للسلة --------------------
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let found = false;

    cart.forEach(item => {
        if(item.name === name) {
            item.qty += 1;
            found = true;
        }
    });

    if(!found) {
        cart.push({name: name, price: price, qty: 1});
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " تمت إضافته للسلة!");
}

// -------------------- عرض السلة في cart.html --------------------
function displayCart() {
    let cartContainer = document.getElementById("cart-container");
    if(!cartContainer) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length === 0) {
        cartContainer.innerHTML = "<p>السلة فارغة</p>";
        return;
    }

    let html = "<ul>";
    let total = 0;

    cart.forEach((item, index) => {
        html += `<li>${item.name} x ${item.qty} = ${item.price*item.qty} درهم 
        <button onclick="removeFromCart(${index})">حذف</button></li>`;
        total += item.price * item.qty;
    });

    html += `</ul><p>المجموع الكلي: ${total} درهم</p>`;
    cartContainer.innerHTML = html;
}

// -------------------- إزالة منتج من السلة --------------------
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index,1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

// -------------------- الدفع عبر واتساب --------------------
function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length === 0) {
        alert("السلة فارغة");
        return;
    }

    let message = "مرحبًا، أريد طلب المنتجات التالية:\n";
    let total = 0;

    cart.forEach(item => {
        message += `${item.name} x ${item.qty} = ${item.price*item.qty} درهم\n`;
        total += item.price * item.qty;
    });

    message += `المجموع الكلي: ${total} درهم`;

    // حفظ الطلب في localStorage للـ Admin Panel
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(cart);
    localStorage.setItem("orders", JSON.stringify(orders));

    // فتح واتساب برابط
    let waLink = "https://wa.me/212629568041?text=" + encodeURIComponent(message);
    window.open(waLink, "_blank");

    // مسح السلة بعد الدفع
    localStorage.removeItem("cart");
    displayCart();
}

// -------------------- تحميل المنتجات تلقائياً --------------------
function loadProducts() {
    const container = document.getElementById("products-container");
    if(!container) return;

    let products = JSON.parse(localStorage.getItem("products")) || [
        {name:"قفطان مغربي", price:750, img:"images/caftan.jpg"},
        {name:"سوار تقليدي", price:120, img:"images/bracelet.jpg"},
        {name:"زيت الأرغان", price:90, img:"images/oil.jpg"}
    ];

    localStorage.setItem("products", JSON.stringify(products));

    let html = "";
    products.forEach(p => {
        html += `<div class="product">
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.price} درهم</p>
            <button onclick="addToCart('${p.name}', ${p.price})">أضف للسلة</button>
        </div>`;
    });

    container.innerHTML = html;
}

// -------------------- حدث التحميل --------------------
document.addEventListener("DOMContentLoaded", () => {
    displayCart();
    loadProducts();

    let checkoutBtn = document.getElementById("checkout-btn");
    if(checkoutBtn) checkoutBtn.addEventListener("click", checkout);
});
