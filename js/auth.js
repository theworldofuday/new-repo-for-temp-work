// Authentication functionality for ProFit Supplements

// Login Form Handler
function initializeLoginForm() {
  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';
        
        // Get form data
        const formData = new FormData(loginForm);
        const credentials = {
          email: formData.get('email'),
          password: formData.get('password')
        };
        
        // Make API request
        const response = await api.login(credentials);
        
        // Success
        showMessage('Login successful! Welcome back!');
        updateAuthUI();
        
        // Close modal
        if (loginModal) {
          const modal = bootstrap.Modal.getInstance(loginModal);
          modal.hide();
        }
        
        // Reset form
        loginForm.reset();
        
      } catch (error) {
        showMessage(error.message || 'Login failed. Please try again.', 'danger');
      } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}

// Register Form Handler
function initializeRegisterForm() {
  const registerModal = document.getElementById('registerModal');
  const registerForm = document.getElementById('registerForm');
  
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';
        
        // Get form data
        const formData = new FormData(registerForm);
        
        // Validate password confirmation
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        const userData = {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          password: password,
          phone: formData.get('phone') || undefined
        };
        
        // Make API request
        const response = await api.register(userData);
        
        // Success
        showMessage('Account created successfully! You are now logged in.');
        updateAuthUI();
        
        // Close modal
        if (registerModal) {
          const modal = bootstrap.Modal.getInstance(registerModal);
          modal.hide();
        }
        
        // Reset form
        registerForm.reset();
        
      } catch (error) {
        showMessage(error.message || 'Registration failed. Please try again.', 'danger');
      } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}

// Profile Form Handler
function initializeProfileForm() {
  const profileForm = document.getElementById('profileForm');
  
  if (profileForm) {
    // Load current profile data
    loadProfileData();
    
    profileForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = profileForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Updating...';
        
        // Get form data
        const formData = new FormData(profileForm);
        const profileData = {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          phone: formData.get('phone') || undefined,
          address: {
            street: formData.get('street') || undefined,
            city: formData.get('city') || undefined,
            state: formData.get('state') || undefined,
            zipCode: formData.get('zipCode') || undefined,
            country: formData.get('country') || 'USA'
          },
          preferences: {
            newsletter: formData.get('newsletter') === 'on',
            notifications: formData.get('notifications') === 'on'
          }
        };
        
        // Make API request
        const response = await api.updateProfile(profileData);
        
        // Success
        showMessage('Profile updated successfully!');
        updateAuthUI();
        
      } catch (error) {
        showMessage(error.message || 'Profile update failed. Please try again.', 'danger');
      } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}

// Load Profile Data
async function loadProfileData() {
  try {
    const response = await api.getProfile();
    const user = response.user;
    
    // Populate form fields
    const form = document.getElementById('profileForm');
    if (form && user) {
      form.querySelector('input[name="firstName"]').value = user.firstName || '';
      form.querySelector('input[name="lastName"]').value = user.lastName || '';
      form.querySelector('input[name="email"]').value = user.email || '';
      form.querySelector('input[name="phone"]').value = user.phone || '';
      
      // Address fields
      if (user.address) {
        const addressFields = ['street', 'city', 'state', 'zipCode', 'country'];
        addressFields.forEach(field => {
          const input = form.querySelector(`input[name="${field}"]`);
          if (input && user.address[field]) {
            input.value = user.address[field];
          }
        });
      }
      
      // Preferences
      if (user.preferences) {
        const newsletterCheckbox = form.querySelector('input[name="newsletter"]');
        const notificationsCheckbox = form.querySelector('input[name="notifications"]');
        
        if (newsletterCheckbox) newsletterCheckbox.checked = user.preferences.newsletter || false;
        if (notificationsCheckbox) notificationsCheckbox.checked = user.preferences.notifications || false;
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    showMessage('Error loading profile data', 'danger');
  }
}

// Change Password Form Handler
function initializeChangePasswordForm() {
  const changePasswordForm = document.getElementById('changePasswordForm');
  
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = changePasswordForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Changing Password...';
        
        // Get form data
        const formData = new FormData(changePasswordForm);
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');
        
        // Validate password confirmation
        if (newPassword !== confirmPassword) {
          throw new Error('New passwords do not match');
        }
        
        const passwordData = {
          currentPassword: formData.get('currentPassword'),
          newPassword: newPassword
        };
        
        // Make API request
        const response = await api.changePassword(passwordData);
        
        // Success
        showMessage('Password changed successfully!');
        changePasswordForm.reset();
        
      } catch (error) {
        showMessage(error.message || 'Password change failed. Please try again.', 'danger');
      } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}

// Auth Modal Switcher
function initializeAuthModals() {
  // Switch from login to register
  const showRegisterLinks = document.querySelectorAll('.show-register');
  showRegisterLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Hide login modal
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        const loginModalInstance = bootstrap.Modal.getInstance(loginModal);
        if (loginModalInstance) loginModalInstance.hide();
      }
      
      // Show register modal
      const registerModal = document.getElementById('registerModal');
      if (registerModal) {
        const registerModalInstance = new bootstrap.Modal(registerModal);
        registerModalInstance.show();
      }
    });
  });
  
  // Switch from register to login
  const showLoginLinks = document.querySelectorAll('.show-login');
  showLoginLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Hide register modal
      const registerModal = document.getElementById('registerModal');
      if (registerModal) {
        const registerModalInstance = bootstrap.Modal.getInstance(registerModal);
        if (registerModalInstance) registerModalInstance.hide();
      }
      
      // Show login modal
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        const loginModalInstance = new bootstrap.Modal(loginModal);
        loginModalInstance.show();
      }
    });
  });
}

// Protected Page Check
function checkAuthRequired() {
  const protectedPages = ['account.html', 'orders.html', 'profile.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage) && !api.isAuthenticated()) {
    showMessage('Please log in to access this page', 'warning');
    window.location.href = 'index.html';
  }
}

// Auto-logout on token expiration
function setupAutoLogout() {
  if (api.isAuthenticated()) {
    // Check token validity periodically
    setInterval(async () => {
      try {
        await api.verifyToken();
      } catch (error) {
        // Token expired or invalid
        api.logout();
        updateAuthUI();
        showMessage('Session expired. Please log in again.', 'warning');
        
        // Redirect if on protected page
        const protectedPages = ['account.html', 'orders.html', 'profile.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
          window.location.href = 'index.html';
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all auth forms
  initializeLoginForm();
  initializeRegisterForm();
  initializeProfileForm();
  initializeChangePasswordForm();
  initializeAuthModals();
  
  // Check if page requires authentication
  checkAuthRequired();
  
  // Setup auto-logout
  setupAutoLogout();
  
  // Add auth modals to pages that don't have them
  addAuthModalsToPage();
});

// Add Auth Modals HTML to Page
function addAuthModalsToPage() {
  // Check if modals already exist
  if (document.getElementById('loginModal')) return;
  
  const modalsHTML = `
    <!-- Login Modal -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="loginModalLabel">Sign In to ProFit</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="loginForm">
              <div class="mb-3">
                <label for="loginEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="loginEmail" name="email" required>
              </div>
              <div class="mb-3">
                <label for="loginPassword" class="form-label">Password</label>
                <input type="password" class="form-control" id="loginPassword" name="password" required>
              </div>
              <button type="submit" class="btn btn-success w-100">Sign In</button>
            </form>
            <hr>
            <p class="text-center mb-0">
              Don't have an account? 
              <a href="#" class="show-register text-decoration-none">Create one here</a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Register Modal -->
    <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="registerModalLabel">Create Account</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="registerForm">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="registerFirstName" class="form-label">First Name</label>
                  <input type="text" class="form-control" id="registerFirstName" name="firstName" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="registerLastName" class="form-label">Last Name</label>
                  <input type="text" class="form-control" id="registerLastName" name="lastName" required>
                </div>
              </div>
              <div class="mb-3">
                <label for="registerEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="registerEmail" name="email" required>
              </div>
              <div class="mb-3">
                <label for="registerPhone" class="form-label">Phone (Optional)</label>
                <input type="tel" class="form-control" id="registerPhone" name="phone">
              </div>
              <div class="mb-3">
                <label for="registerPassword" class="form-label">Password</label>
                <input type="password" class="form-control" id="registerPassword" name="password" required minlength="6">
              </div>
              <div class="mb-3">
                <label for="registerConfirmPassword" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="registerConfirmPassword" name="confirmPassword" required>
              </div>
              <button type="submit" class="btn btn-success w-100">Create Account</button>
            </form>
            <hr>
            <p class="text-center mb-0">
              Already have an account? 
              <a href="#" class="show-login text-decoration-none">Sign in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalsHTML);
}