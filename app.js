// Shopping Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count display
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Update product quantity
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(newQuantity));
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

// Display featured products on home page
function displayFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-grid');
    if (!featuredGrid) return;
    
    const featured = products.slice(0, 6);
    featuredGrid.innerHTML = featured.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">⭐ ${product.rating}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Display all products with filtering
function displayProducts(productsToShow = products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found.</p>';
        return;
    }
    
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">⭐ ${product.rating}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Display shopping cart
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTable = document.getElementById('cart-table');
    
    if (!cartItemsContainer) return;
    
    updateCartCount();
    
    if (cart.length === 0) {
        if (cartTable) cartTable.style.display = 'none';
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        return;
    }
    
    if (cartTable) cartTable.style.display = 'table';
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><input type="number" class="quantity-input" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)"></td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button></td>
        </tr>
    `).join('');
    
    updateCartTotal();
}

// Calculate and display cart total
function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Filter products by search
function filterBySearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filtered);
}

// Filter products by category
function filterByCategory() {
    const categorySelect = document.getElementById('category-filter');
    if (!categorySelect) return;
    
    const category = categorySelect.value;
    const filtered = category ? products.filter(p => p.category === category) : products;
    
    displayProducts(filtered);
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterBySearch);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterByCategory);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
            } else {
                alert(`Order placed! Total: $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)} + tax`);
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCart();
            }
        });
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    displayFeaturedProducts();
    displayProducts();
    displayCart();
    setupEventListeners();
});