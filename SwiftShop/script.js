// ============================================
// STATE MANAGEMENT
// ============================================

let cart = [];
let currentCategory = 'All';
let currentSearchTerm = '';
let maxPrice = 500;

// ============================================
// LOCALSTORAGE FUNCTIONS
// ============================================

/**
 * Save cart to localStorage
 * Uses JSON.stringify to convert array to string for storage
 */
function saveToStorage() {
    try {
        localStorage.setItem('modernshop_cart', JSON.stringify(cart));
        console.log('Cart saved to localStorage:', cart);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Load cart from localStorage on page load
 * Uses JSON.parse to convert stored string back to array
 */
function loadFromStorage() {
    try {
        const storedCart = localStorage.getItem('modernshop_cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            console.log('Cart loaded from localStorage:', cart);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        cart = [];
    }
}

// ============================================
// PRODUCT DISPLAY FUNCTIONS
// ============================================

/**
 * Main function to display products
 * Takes an array of products and renders them to the DOM
 */
function displayProducts(productsArray) {
    const container = document.getElementById('productsContainer');
    const emptyState = document.getElementById('emptyState');
    
    // Check if there are products to display
    if (productsArray.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    // Use map to create HTML for each product
    container.innerHTML = productsArray.map(product => {
        // Check if product is already in cart
        const inCart = cart.some(item => item.id === product.id);
        
        return `
            <article class="product-card" data-product-id="${product.id}">
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <span class="product-category">${product.category}</span>
                </div>
                <div class="product-details">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button 
                            class="add-to-cart-btn ${inCart ? 'in-cart' : ''}" 
                            onclick="addToCart(${product.id})"
                            ${inCart ? 'disabled' : ''}
                        >
                            ${inCart ? '✓ In Cart' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
    
    // Add animation to cards
    animateProducts();
}

/**
 * Animate product cards on render
 */
function animateProducts() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// ============================================
// FILTER FUNCTIONS
// ============================================

/**
 * Filter products by category
 * Uses .filter() array method to show only matching items
 */
function filterByCategory(category) {
    currentCategory = category;
    
    // Update active button styling
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // Apply all filters
    applyFilters();
}

/**
 * Handle search input
 * Filters products by name using includes() method
 */
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    
    currentSearchTerm = searchInput.value.toLowerCase().trim();
    
    // Show/hide clear button
    clearBtn.style.display = currentSearchTerm ? 'block' : 'none';
    
    // Apply all filters
    applyFilters();
}

/**
 * Clear search input
 */
function clearSearch() {
    document.getElementById('searchInput').value = '';
    currentSearchTerm = '';
    document.getElementById('clearSearchBtn').style.display = 'none';
    applyFilters();
}

/**
 * Handle price range filter
 */
function handlePriceFilter() {
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    maxPrice = parseFloat(priceRange.value);
    priceValue.textContent = `$${maxPrice}`;
    
    applyFilters();
}

/**
 * Apply all filters at once
 * Combines category, search, and price filters
 */
function applyFilters() {
    let filteredProducts = [...products];
    
    // Filter by category
    if (currentCategory !== 'All') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === currentCategory
        );
    }
    
    // Filter by search term
    if (currentSearchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(currentSearchTerm) ||
            product.description.toLowerCase().includes(currentSearchTerm) ||
            product.category.toLowerCase().includes(currentSearchTerm)
        );
    }
    
    // Filter by price
    filteredProducts = filteredProducts.filter(product => 
        product.price <= maxPrice
    );
    
    displayProducts(filteredProducts);
}

/**
 * Reset all filters to default
 */
function resetFilters() {
    currentCategory = 'All';
    currentSearchTerm = '';
    maxPrice = 500;
    
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearchBtn').style.display = 'none';
    document.getElementById('priceRange').value = 500;
    document.getElementById('priceValue').textContent = '$500';
    
    filterByCategory('All');
}

// ============================================
// CART FUNCTIONS
// ============================================

/**
 * Add product to cart
 * Checks if item exists, increases quantity or adds new item
 */
function addToCart(productId) {
    // Find the product in products array
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Increase quantity
        existingItem.quantity += 1;
        showToast(`Increased ${product.name} quantity`);
    } else {
        // Add new item with quantity: 1
        cart.push({
            ...product,
            quantity: 1
        });
        showToast(`${product.name} added to cart!`);
    }
    
    // Save to localStorage
    saveToStorage();
    
    // Update UI
    updateCartDisplay();
    applyFilters(); // Re-render products to update button states
}

/**
 * Remove item from cart with animation
 */
function removeFromCart(productId) {
    const cartItem = document.querySelector(`[data-cart-item-id="${productId}"]`);
    
    if (cartItem) {
        // Add fade-out animation
        cartItem.style.animation = 'fadeOut 0.3s ease-out';
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            // Remove from cart array
            cart = cart.filter(item => item.id !== productId);
            
            // Save to localStorage
            saveToStorage();
            
            // Update UI
            updateCartDisplay();
            applyFilters(); // Re-render products to update button states
        }, 300);
    }
}

/**
 * Update quantity of cart item
 */
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        // Remove item if quantity reaches 0
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        // Save to localStorage
        saveToStorage();
        
        // Update UI
        updateCartDisplay();
    }
}

/**
 * Clear all items from cart
 */
function clearCart() {
    if (cart.length === 0) {
        showToast('Cart is already empty');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveToStorage();
        updateCartDisplay();
        applyFilters();
        showToast('Cart cleared successfully');
    }
}

/**
 * Update cart display (badge and items)
 */
function updateCartDisplay() {
    // Update cart badge
    const cartBadge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    // Add animation to badge when updated
    cartBadge.style.animation = 'none';
    setTimeout(() => {
        cartBadge.style.animation = 'pop 0.3s ease';
    }, 10);
    
    // Render cart items
    renderCartItems();
}

/**
 * Render cart items in sidebar
 */
function renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
                <button class="browse-btn" onclick="closeCart()">Continue Shopping</button>
            </div>
        `;
        checkoutBtn.disabled = true;
        updateCartSummary();
        return;
    }
    
    checkoutBtn.disabled = false;
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item" data-cart-item-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <span class="item-subtotal">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

/**
 * Update cart summary (subtotal, tax, total)
 */
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
}

/**
 * Toggle cart sidebar
 */
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

/**
 * Close cart sidebar
 */
function closeCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Checkout process
 */
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    
    let orderSummary = '🎉 Order Confirmation\n\n';
    orderSummary += 'Items:\n';
    cart.forEach(item => {
        orderSummary += `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    orderSummary += `\nSubtotal: $${subtotal.toFixed(2)}`;
    orderSummary += `\nTax (10%): $${tax.toFixed(2)}`;
    orderSummary += `\n━━━━━━━━━━━━━━━━━━━━`;
    orderSummary += `\nTotal: $${total.toFixed(2)}`;
    orderSummary += '\n\nThank you for your purchase! 🎁';
    
    alert(orderSummary);
    
    // Clear cart after checkout
    cart = [];
    saveToStorage();
    updateCartDisplay();
    applyFilters();
    closeCart();
    
    showToast('Order placed successfully!');
}

// ============================================
// TOAST NOTIFICATION
// ============================================

/**
 * Show toast notification
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the application
 * Called when page loads (BOM - Browser Object Model)
 */
function init() {
    console.log('🚀 Initializing ModernShop...');
    
    // Load cart from localStorage
    loadFromStorage();
    
    // Display all products initially
    displayProducts(products);
    
    // Update cart display
    updateCartDisplay();
    
    console.log('✅ ModernShop initialized successfully!');
    console.log(`📦 Products loaded: ${products.length}`);
    console.log(`🛒 Cart items: ${cart.length}`);
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
