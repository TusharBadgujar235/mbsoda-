// Shopping Cart System
let cart = [];
const DELIVERY_CHARGE = 50;

// Product data
const products = [
    { id: 1, name: 'Cola Drinks', category: 'cola', price: 30, minPrice: 30, maxPrice: 150 },
    { id: 2, name: 'Fruit Sodas', category: 'fruit', price: 40, minPrice: 40, maxPrice: 180 },
    { id: 3, name: 'Lemonade & Coolers', category: 'lemonade', price: 35, minPrice: 35, maxPrice: 160 },
    { id: 4, name: 'Milkshakes', category: 'milkshakes', price: 60, minPrice: 60, maxPrice: 200 },
    { id: 5, name: 'Mocktails', category: 'mocktails', price: 50, minPrice: 50, maxPrice: 180 },
    { id: 6, name: 'Fresh Juices', category: 'juices', price: 45, minPrice: 45, maxPrice: 170 }
];

// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const checkoutModal = document.getElementById('checkoutModal');
const closeCartBtn = document.getElementById('closeCart');
const closeCheckoutBtn = document.getElementById('closeCheckout');
const continueShoppingBtn = document.getElementById('continueShopping');
const checkoutBtn = document.getElementById('checkoutBtn');
const backToCartBtn = document.getElementById('backToCart');
const checkoutForm = document.getElementById('checkoutForm');

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(10px, 10px)' : '';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(7px, -7px)' : '';
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        });
    });
}

// Cart Modal Functions
cartIcon.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
continueShoppingBtn.addEventListener('click', closeCart);
checkoutBtn.addEventListener('click', openCheckout);
closeCheckoutBtn.addEventListener('click', closeCheckout);
backToCartBtn.addEventListener('click', () => {
    closeCheckout();
    openCart();
});

function openCart() {
    cartModal.classList.add('active');
    updateCartDisplay();
}

function closeCart() {
    cartModal.classList.remove('active');
}

function openCheckout() {
    if (cart.length === 0) {
        alert('Please add items to your cart first!');
        return;
    }
    cartModal.classList.remove('active');
    checkoutModal.classList.add('active');
    updateCheckoutDisplay();
}

function closeCheckout() {
    checkoutModal.classList.remove('active');
}

// Add to Cart
document.querySelectorAll('.btn-secondary').forEach((btn, index) => {
    if (index < 6) { // Only product buttons
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = index + 1;
            const product = products.find(p => p.id === productId);
            addToCart(product);
        });
    }
});

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    showAddedNotification();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function showAddedNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #4ECDC4;
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        z-index: 3000;
        animation: slideInRight 0.5s ease;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    `;
    notification.textContent = '✓ Added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

function updateCartDisplay() {
    const container = document.getElementById('cartItemsContainer');
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">Your cart is empty</p>';
        document.getElementById('subtotal').textContent = '₹0';
        document.getElementById('deliveryCharge').textContent = '₹0';
        document.getElementById('totalAmount').textContent = '₹0';
        checkoutBtn.disabled = true;
        return;
    }
    
    checkoutBtn.disabled = false;
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">₹${item.price}</div>
            </div>
            <div class="quantity-controls">
                <button type="button" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button type="button" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div style="text-align: right; min-width: 100px;">
                <div style="font-weight: 600; margin-bottom: 0.5rem;">₹${item.price * item.quantity}</div>
                <button type="button" class="remove-item" onclick="removeFromCart(${item.id})" title="Remove">🗑️</button>
            </div>
        </div>
    `).join('');
    
    updateSummary();
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = cart.length > 0 ? DELIVERY_CHARGE : 0;
    const total = subtotal + deliveryCharge;
    
    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('deliveryCharge').textContent = `₹${deliveryCharge}`;
    document.getElementById('totalAmount').textContent = `₹${total}`;
}

function updateCheckoutDisplay() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = DELIVERY_CHARGE;
    const total = subtotal + deliveryCharge;
    
    // Update items list
    const itemsContainer = document.getElementById('checkoutItemsContainer');
    itemsContainer.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
        </div>
    `).join('');
    
    // Update summary
    document.getElementById('checkoutSubtotal').textContent = `₹${subtotal}`;
    document.getElementById('checkoutDeliveryCharge').textContent = `₹${deliveryCharge}`;
    document.getElementById('checkoutTotal').textContent = `₹${total}`;
}

// Checkout Form Submission
checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const pincode = document.getElementById('pincode').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Validate phone number
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }
    
    // Create order summary
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + DELIVERY_CHARGE;
    
    const orderDetails = {
        customer: {
            name: fullName,
            phone: phone,
            email: email,
            address: `${address}, ${city} - ${pincode}`
        },
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
        })),
        subtotal: subtotal,
        deliveryCharge: DELIVERY_CHARGE,
        total: total,
        paymentMethod: paymentMethod,
        orderDate: new Date().toLocaleString()
    };
    
    // Save order (in real application, send to server)
    saveOrder(orderDetails);
    
    // Show success message
    showOrderSuccess(orderDetails);
});

function saveOrder(orderDetails) {
    // Store in localStorage for demo purposes
    let orders = JSON.parse(localStorage.getItem('mbOrders')) || [];
    orders.push(orderDetails);
    localStorage.setItem('mbOrders', JSON.stringify(orders));
}

function showOrderSuccess(orderDetails) {
    const successHTML = `
        <div class="success-message">
            <h3>✓ Order Placed Successfully!</h3>
            <p>Thank you for your order, ${orderDetails.customer.name}</p>
        </div>
        <div style="padding: 1.5rem; background-color: var(--light-color);">
            <h4 style="color: var(--dark-color); margin-bottom: 1rem;">Order Summary</h4>
            <div style="font-size: 0.95rem; line-height: 2;">
                <div><strong>Order ID:</strong> #${Math.floor(100000 + Math.random() * 900000)}</div>
                <div><strong>Order Date:</strong> ${orderDetails.orderDate}</div>
                <div style="margin-top: 1rem; border-top: 1px solid #ddd; padding-top: 1rem;">
                    <div><strong>Delivery Address:</strong></div>
                    <div style="margin-left: 1rem; color: #666;">${orderDetails.customer.address}</div>
                </div>
                <div style="margin-top: 1rem; border-top: 1px solid #ddd; padding-top: 1rem;">
                    <div><strong>Payment Method:</strong> ${orderDetails.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Payment'}</div>
                    <div style="margin-top: 0.5rem;"><strong>Total Amount:</strong> <span style="color: var(--primary-color); font-size: 1.2rem;">₹${orderDetails.total}</span></div>
                </div>
                <div style="margin-top: 1.5rem; text-align: center; color: #666;">
                    <p>You will receive a confirmation call shortly.</p>
                    <p style="font-size: 0.9rem;">For inquiries, contact us at +91 XXXXX XXXXX</p>
                </div>
            </div>
        </div>
        <div style="padding: 1.5rem; display: flex; gap: 1rem;">
            <button class="btn btn-primary full-width" onclick="backToHome()" style="flex: 1;">Back to Home</button>
        </div>
    `;
    
    checkoutForm.style.display = 'none';
    const container = checkoutForm.parentElement;
    const successDiv = document.createElement('div');
    successDiv.innerHTML = successHTML;
    container.appendChild(successDiv);
    
    // Clear cart
    cart = [];
    updateCartCount();
}

function backToHome() {
    // Reset checkout form
    checkoutForm.style.display = '';
    checkoutForm.reset();
    document.querySelector('.success-message').parentElement.parentElement.remove();
    
    closeCheckout();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Smooth scroll for buttons
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(this);
        
        // Show success message
        alert('Thank you for contacting MB Soda Center! We will get back to you soon.');
        
        // Reset form
        this.reset();
    });
}

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Scroll to top functionality
window.addEventListener('scroll', function() {
    // Change navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Form validation
const formInputs = document.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });

    input.addEventListener('focus', function() {
        this.style.borderColor = '#FF6B6B';
    });
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === cartModal) {
        closeCart();
    }
    if (event.target === checkoutModal) {
        closeCheckout();
    }
});

// Add animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('MB Soda Center Ordering System Loaded!');
