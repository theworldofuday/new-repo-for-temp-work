// Products functionality for ProFit Supplements

// Product Display Manager
class ProductManager {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentFilters = {
      category: '',
      priceRange: '',
      search: '',
      sort: 'newest'
    };
    this.currentPage = 1;
    this.itemsPerPage = 12;
  }

  // Load and display products
  async loadProducts(params = {}) {
    try {
      const response = await api.getProducts({
        page: this.currentPage,
        limit: this.itemsPerPage,
        ...this.currentFilters,
        ...params
      });

      this.products = response.products;
      this.pagination = response.pagination;
      
      this.displayProducts();
      this.updatePagination();
      
      return response;
    } catch (error) {
      console.error('Error loading products:', error);
      showMessage('Error loading products', 'danger');
      return { products: [], pagination: {} };
    }
  }

  // Display products in grid
  displayProducts() {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;

    if (this.products.length === 0) {
      productsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <h4>No products found</h4>
          <p class="text-muted">Try adjusting your filters or search terms.</p>
        </div>
      `;
      return;
    }

    const productsHTML = this.products.map(product => this.createProductCard(product)).join('');
    productsContainer.innerHTML = productsHTML;
  }

  // Create product card HTML
  createProductCard(product) {
    const discountBadge = product.discountPercentage > 0 
      ? `<span class="badge bg-danger position-absolute" style="top: 10px; right: 10px;">${product.discountPercentage}% OFF</span>`
      : '';

    const outOfStockBadge = !product.isAvailable
      ? `<span class="badge bg-secondary position-absolute" style="top: 10px; left: 10px;">Out of Stock</span>`
      : '';

    const price = product.salePrice 
      ? `<span class="text-success fw-bold">${formatPrice(product.salePrice)}</span> <span class="text-muted text-decoration-line-through">${formatPrice(product.price)}</span>`
      : `<span class="text-success fw-bold">${formatPrice(product.price)}</span>`;

    return `
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="card h-100 product-card position-relative">
          ${discountBadge}
          ${outOfStockBadge}
          <div class="card-img-container" style="height: 250px; overflow: hidden;">
            <img src="${product.images[0]?.url || '/img/placeholder-product.jpg'}" 
                 class="card-img-top" 
                 alt="${product.name}"
                 style="height: 100%; object-fit: cover; transition: transform 0.3s;"
                 onmouseover="this.style.transform='scale(1.05)'"
                 onmouseout="this.style.transform='scale(1)'">
          </div>
          <div class="card-body d-flex flex-column">
            <span class="badge bg-light text-dark mb-2 align-self-start">${product.category}</span>
            <h6 class="card-title">${product.name}</h6>
            <p class="card-text text-muted small flex-grow-1">${product.shortDescription || product.description.substring(0, 100) + '...'}</p>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <div>${price}</div>
              <div class="rating">
                ${this.createStarRating(product.ratings.average)}
                <small class="text-muted">(${product.ratings.totalReviews})</small>
              </div>
            </div>
            <div class="mt-3 d-grid gap-2">
              <button class="btn btn-outline-success btn-sm" onclick="productManager.viewProduct('${product._id}')">
                View Details
              </button>
              ${product.isAvailable 
                ? `<button class="btn btn-success btn-sm" onclick="productManager.addToCart('${product._id}')">
                     <i class="fas fa-cart-plus me-1"></i> Add to Cart
                   </button>`
                : `<button class="btn btn-secondary btn-sm" disabled>Out of Stock</button>`
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Create star rating HTML
  createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fas fa-star text-warning"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
      starsHTML += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="far fa-star text-warning"></i>';
    }

    return starsHTML;
  }

  // View product details
  viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
  }

  // Add product to cart
  async addToCart(productId) {
    try {
      // Get product details
      const response = await api.getProduct(productId);
      const product = response.product;
      
      // Add to cart
      cart.addItem(product, 1);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      showMessage('Error adding product to cart', 'danger');
    }
  }

  // Apply filters
  applyFilters(filters) {
    this.currentFilters = { ...this.currentFilters, ...filters };
    this.currentPage = 1; // Reset to first page
    this.loadProducts();
  }

  // Update pagination
  updatePagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer || !this.pagination) return;

    const { currentPage, totalPages, hasNextPage, hasPrevPage } = this.pagination;

    let paginationHTML = '<nav><ul class="pagination justify-content-center">';

    // Previous button
    paginationHTML += `
      <li class="page-item ${!hasPrevPage ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="productManager.goToPage(${currentPage - 1})">Previous</a>
      </li>
    `;

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" onclick="productManager.goToPage(${i})">${i}</a>
        </li>
      `;
    }

    // Next button
    paginationHTML += `
      <li class="page-item ${!hasNextPage ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="productManager.goToPage(${currentPage + 1})">Next</a>
      </li>
    `;

    paginationHTML += '</ul></nav>';
    paginationContainer.innerHTML = paginationHTML;
  }

  // Go to specific page
  goToPage(page) {
    if (page < 1 || (this.pagination && page > this.pagination.totalPages)) return;
    this.currentPage = page;
    this.loadProducts();
    
    // Scroll to top of products
    const productsSection = document.getElementById('productsContainer');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Initialize product manager
const productManager = new ProductManager();

// Product Details Page
async function loadProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    showMessage('Product not found', 'danger');
    window.location.href = 'product.html';
    return;
  }

  try {
    const response = await api.getProduct(productId);
    const product = response.product;
    const relatedProducts = response.relatedProducts;

    displayProductDetails(product);
    displayRelatedProducts(relatedProducts);
    
  } catch (error) {
    console.error('Error loading product details:', error);
    showMessage('Error loading product details', 'danger');
  }
}

// Display product details
function displayProductDetails(product) {
  // Update page title
  document.title = `${product.name} - ProFit Supplements`;

  // Product images
  const mainImage = document.getElementById('mainProductImage');
  if (mainImage && product.images.length > 0) {
    mainImage.src = product.images[0].url;
    mainImage.alt = product.name;
  }

  // Product thumbnails
  const thumbnailContainer = document.getElementById('productThumbnails');
  if (thumbnailContainer && product.images.length > 1) {
    const thumbnailsHTML = product.images.map((image, index) => `
      <img src="${image.url}" 
           alt="${product.name}" 
           class="img-thumbnail me-2 mb-2" 
           style="width: 80px; height: 80px; object-fit: cover; cursor: pointer;"
           onclick="changeMainImage('${image.url}')">
    `).join('');
    thumbnailContainer.innerHTML = thumbnailsHTML;
  }

  // Product info
  const productName = document.getElementById('productName');
  if (productName) productName.textContent = product.name;

  const productPrice = document.getElementById('productPrice');
  if (productPrice) {
    if (product.salePrice) {
      productPrice.innerHTML = `
        <span class="h4 text-success me-2">${formatPrice(product.salePrice)}</span>
        <span class="h6 text-muted text-decoration-line-through">${formatPrice(product.price)}</span>
        <span class="badge bg-danger ms-2">${product.discountPercentage}% OFF</span>
      `;
    } else {
      productPrice.innerHTML = `<span class="h4 text-success">${formatPrice(product.price)}</span>`;
    }
  }

  const productDescription = document.getElementById('productDescription');
  if (productDescription) productDescription.innerHTML = product.description.replace(/\n/g, '<br>');

  // Product specifications
  const productSpecs = document.getElementById('productSpecs');
  if (productSpecs && product.specifications) {
    const specsHTML = `
      <h6>Product Specifications</h6>
      <ul class="list-unstyled">
        ${product.specifications.servingSize ? `<li><strong>Serving Size:</strong> ${product.specifications.servingSize}</li>` : ''}
        ${product.specifications.servingsPerContainer ? `<li><strong>Servings Per Container:</strong> ${product.specifications.servingsPerContainer}</li>` : ''}
        ${product.specifications.weight ? `<li><strong>Weight:</strong> ${product.specifications.weight}</li>` : ''}
        ${product.specifications.flavor && product.specifications.flavor.length > 0 ? `<li><strong>Flavors:</strong> ${product.specifications.flavor.join(', ')}</li>` : ''}
      </ul>
    `;
    productSpecs.innerHTML = specsHTML;
  }

  // Stock status
  const stockStatus = document.getElementById('stockStatus');
  if (stockStatus) {
    if (product.isAvailable) {
      stockStatus.innerHTML = '<span class="badge bg-success">In Stock</span>';
    } else {
      stockStatus.innerHTML = '<span class="badge bg-danger">Out of Stock</span>';
    }
  }

  // Add to cart button
  const addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn) {
    if (product.isAvailable) {
      addToCartBtn.disabled = false;
      addToCartBtn.textContent = 'Add to Cart';
      addToCartBtn.onclick = () => {
        const quantity = parseInt(document.getElementById('quantity')?.value || 1);
        cart.addItem(product, quantity);
      };
    } else {
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = 'Out of Stock';
    }
  }
}

// Change main product image
function changeMainImage(imageUrl) {
  const mainImage = document.getElementById('mainProductImage');
  if (mainImage) {
    mainImage.src = imageUrl;
  }
}

// Display related products
function displayRelatedProducts(products) {
  const relatedContainer = document.getElementById('relatedProducts');
  if (!relatedContainer || !products || products.length === 0) return;

  const relatedHTML = products.map(product => `
    <div class="col-md-3 mb-4">
      <div class="card h-100">
        <img src="${product.images[0]?.url || '/img/placeholder-product.jpg'}" 
             class="card-img-top" 
             alt="${product.name}"
             style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <h6 class="card-title">${product.name}</h6>
          <p class="text-success fw-bold">${formatPrice(product.salePrice || product.price)}</p>
          <button class="btn btn-outline-success btn-sm w-100" onclick="window.location.href='product.html?id=${product._id}'">
            View Details
          </button>
        </div>
      </div>
    </div>
  `).join('');

  relatedContainer.innerHTML = relatedHTML;
}

// Initialize filters
function initializeProductFilters() {
  // Category filter
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
      productManager.applyFilters({ category: this.value });
    });
  }

  // Price range filter
  const priceRangeFilter = document.getElementById('priceRangeFilter');
  if (priceRangeFilter) {
    priceRangeFilter.addEventListener('change', function() {
      const [minPrice, maxPrice] = this.value.split('-');
      productManager.applyFilters({ 
        minPrice: minPrice || '', 
        maxPrice: maxPrice || '' 
      });
    });
  }

  // Search filter
  const searchInput = document.getElementById('productSearch');
  const searchBtn = document.getElementById('searchBtn');
  
  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', function() {
      productManager.applyFilters({ search: searchInput.value });
    });

    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        productManager.applyFilters({ search: this.value });
      }
    });
  }

  // Sort filter
  const sortFilter = document.getElementById('sortFilter');
  if (sortFilter) {
    sortFilter.addEventListener('change', function() {
      productManager.applyFilters({ sort: this.value });
    });
  }
}

// Load featured products for homepage
async function loadFeaturedProducts() {
  try {
    const response = await api.getFeaturedProducts(6);
    const featuredContainer = document.getElementById('featuredProducts');
    
    if (featuredContainer && response.products) {
      const productsHTML = response.products.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
          ${productManager.createProductCard(product)}
        </div>
      `).join('');
      
      featuredContainer.innerHTML = productsHTML;
    }
  } catch (error) {
    console.error('Error loading featured products:', error);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize based on current page
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentPage === 'product.html') {
    // Product listing page
    initializeProductFilters();
    productManager.loadProducts();
  } else if (currentPage === 'product-details.html') {
    // Product details page
    loadProductDetails();
  } else if (currentPage === 'index.html' || currentPage === '') {
    // Homepage
    loadFeaturedProducts();
  }
});

// Export for global access
window.productManager = productManager;
window.loadProductDetails = loadProductDetails;
window.changeMainImage = changeMainImage;