/const API_BASE_URL = 'http://localhost:3002/api'; API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Helper Class
class ProfitAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Get authentication headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        ...options,
        headers: {
          ...this.getHeaders(options.auth !== false),
          ...options.headers
        }
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      auth: false
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      auth: false
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    this.setToken(null);
    return { message: 'Logged out successfully' };
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }

  async verifyToken() {
    return this.request('/auth/verify-token', {
      method: 'POST'
    });
  }

  // Product methods
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`, { auth: false });
  }

  async getFeaturedProducts(limit = 6) {
    return this.request(`/products/featured?limit=${limit}`, { auth: false });
  }

  async getProductCategories() {
    return this.request('/products/categories', { auth: false });
  }

  async searchProducts(query, limit = 10) {
    return this.request(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`, { auth: false });
  }

  async getProduct(id) {
    return this.request(`/products/${id}`, { auth: false });
  }

  // Order methods
  async createOrder(orderData) {
    return this.request('/orders/create', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders?${queryString}`);
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async cancelOrder(orderId) {
    return this.request(`/orders/${orderId}/cancel`, {
      method: 'PUT'
    });
  }

  // Blog methods
  async getBlogPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/blog?${queryString}`, { auth: false });
  }

  async getFeaturedBlogPosts(limit = 3) {
    return this.request(`/blog/featured?limit=${limit}`, { auth: false });
  }

  async getBlogCategories() {
    return this.request('/blog/categories', { auth: false });
  }

  async searchBlogPosts(query, limit = 5) {
    return this.request(`/blog/search?q=${encodeURIComponent(query)}&limit=${limit}`, { auth: false });
  }

  async getBlogPost(slug) {
    return this.request(`/blog/${slug}`, { auth: false });
  }

  // Contact methods
  async submitContactForm(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
      auth: false
    });
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get user from token (basic decode - not secure, just for UI)
  getUser() {
    if (!this.token) return null;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return payload;
    } catch (error) {
      return null;
    }
  }
}

// Initialize API instance
const api = new ProfitAPI();

// Shopping Cart Class
class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.updateCartUI();
  }

  loadCart() {
    const savedCart = localStorage.getItem('shoppingCart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    this.updateCartUI();
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.productId === product._id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        productId: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images[0]?.url || '',
        quantity: quantity
      });
    }

    this.saveCart();
    this.showCartNotification(`${product.name} added to cart!`);
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.productId !== productId);
    this.saveCart();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clear() {
    this.items = [];
    this.saveCart();
  }

  updateCartUI() {
    // Update cart count in navbar
    const cartCountElements = document.querySelectorAll('.cart-count');
    const itemCount = this.getItemCount();
    
    cartCountElements.forEach(element => {
      element.textContent = itemCount;
      element.style.display = itemCount > 0 ? 'inline' : 'none';
    });

    // Update cart dropdown if exists
    this.updateCartDropdown();
  }

  updateCartDropdown() {
    const cartDropdown = document.querySelector('.cart-dropdown');
    if (!cartDropdown) return;

    if (this.items.length === 0) {
      cartDropdown.innerHTML = '<p class="text-center text-muted p-3">Your cart is empty</p>';
      return;
    }

    const cartHTML = `
      <div class="cart-items">
        ${this.items.map(item => `
          <div class="cart-item d-flex align-items-center p-2 border-bottom">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image me-2" style="width: 40px; height: 40px; object-fit: cover;">
            <div class="flex-grow-1">
              <div class="cart-item-name fw-bold" style="font-size: 0.85rem;">${item.name}</div>
              <div class="cart-item-price text-success">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="cart.removeItem('${item.productId}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `).join('')}
      </div>
      <div class="cart-footer p-3 border-top">
        <div class="d-flex justify-content-between mb-2">
          <strong>Total: $${this.getTotal().toFixed(2)}</strong>
        </div>
        <div class="d-grid gap-2">
          <a href="order.html" class="btn btn-success btn-sm">View Cart</a>
          <button class="btn btn-outline-secondary btn-sm" onclick="cart.clear()">Clear Cart</button>
        </div>
      </div>
    `;

    cartDropdown.innerHTML = cartHTML;
  }

  showCartNotification(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.remove();
      style.remove();
    }, 3000);
  }
}

// Initialize shopping cart
const cart = new ShoppingCart();

// Auth Helper Functions
function updateAuthUI() {
  const isLoggedIn = api.isAuthenticated();
  const loginButtons = document.querySelectorAll('.login-btn');
  const logoutButtons = document.querySelectorAll('.logout-btn');
  const userMenus = document.querySelectorAll('.user-menu');

  loginButtons.forEach(btn => {
    btn.style.display = isLoggedIn ? 'none' : 'inline-block';
  });

  logoutButtons.forEach(btn => {
    btn.style.display = isLoggedIn ? 'inline-block' : 'none';
  });

  userMenus.forEach(menu => {
    menu.style.display = isLoggedIn ? 'block' : 'none';
  });

  // Update user name if available
  if (isLoggedIn) {
    const user = api.getUser();
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
      element.textContent = user?.firstName || 'User';
    });
  }
}

// Utility Functions
function showMessage(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  // Find a container or create one
  let container = document.querySelector('.message-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'message-container';
    container.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; width: 90%; max-width: 500px;';
    document.body.appendChild(container);
  }

  container.appendChild(alertDiv);

  // Auto remove after 5 seconds
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  updateAuthUI();
  
  // Add logout functionality
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('logout-btn')) {
      e.preventDefault();
      api.logout();
      updateAuthUI();
      showMessage('Logged out successfully');
      
      // Redirect to home if on protected page
      if (window.location.pathname.includes('account') || window.location.pathname.includes('admin')) {
        window.location.href = 'index.html';
      }
    }
  });
});

// Export for use in other files
window.api = api;
window.cart = cart;
window.showMessage = showMessage;
window.updateAuthUI = updateAuthUI;
window.formatPrice = formatPrice;
window.formatDate = formatDate;