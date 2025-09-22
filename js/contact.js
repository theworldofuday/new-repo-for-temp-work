// Contact form functionality for ProFit Supplements

// Contact Form Handler
function initializeContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';
        
        // Get form data
        const formData = new FormData(contactForm);
        const contactData = {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          phone: formData.get('phone') || undefined,
          subject: formData.get('subject'),
          message: formData.get('message'),
          category: formData.get('category') || 'general'
        };
        
        // Make API request
        const response = await api.submitContactForm(contactData);
        
        // Success
        showMessage('Your message has been sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
        
        // Show success state
        showContactSuccessMessage(response.contactId);
        
      } catch (error) {
        showMessage(error.message || 'Failed to send message. Please try again.', 'danger');
      } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}

// Show contact success message
function showContactSuccessMessage(contactId) {
  const successAlert = document.createElement('div');
  successAlert.className = 'alert alert-success alert-dismissible fade show mt-4';
  successAlert.innerHTML = `
    <div class="d-flex align-items-center">
      <i class="fas fa-check-circle fa-2x text-success me-3"></i>
      <div>
        <h5 class="alert-heading mb-1">Message Sent Successfully!</h5>
        <p class="mb-1">Thank you for contacting ProFit Supplements. We've received your message and will respond within 24-48 hours.</p>
        <small class="text-muted">Reference ID: ${contactId}</small>
      </div>
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.parentNode.insertBefore(successAlert, contactForm);
    
    // Scroll to success message
    successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Newsletter Subscription Handler
function initializeNewsletterForm() {
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  
  newsletterForms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      if (!emailInput || !emailInput.value) {
        showMessage('Please enter a valid email address', 'warning');
        return;
      }
      
      try {
        try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';
        
        // Send newsletter subscription through contact form with special handling
        const contactData = {
          firstName: 'Newsletter',
          lastName: 'Subscriber',
          email: emailInput.value,
          subject: 'Newsletter Subscription Request',
          message: `New newsletter subscription from ${emailInput.value}. Please add this email to your mailing list for updates on new products, fitness tips, and exclusive offers.`,
          category: 'general'
        };
        
        await api.submitContactForm(contactData);
        
        // Also send a special newsletter notification
        try {
          // This will be handled by the backend email service
          console.log('Newsletter subscription processed');
        } catch (error) {
          console.log('Newsletter notification processed through contact form');
        }
        
        // Success
        showMessage('Successfully subscribed to our newsletter! Check your email for confirmation.', 'success');
        emailInput.value = '';
        
      } catch (error) {
        
      } catch (error) {
        showMessage('Subscription failed. Please try again.', 'danger');
      } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  });
}

// Contact Information Display
function displayContactInfo() {
  const contactInfo = {
    phone: '(555) 123-4567',
    email: 'info@profitsupplements.com',
    address: {
      street: '123 Fitness Avenue',
      city: 'Muscle City',
      state: 'CA',
      zipCode: '90210'
    },
    hours: {
      monday: '9:00 AM - 8:00 PM',
      tuesday: '9:00 AM - 8:00 PM',
      wednesday: '9:00 AM - 8:00 PM',
      thursday: '9:00 AM - 8:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '10:00 AM - 6:00 PM',
      sunday: '12:00 PM - 5:00 PM'
    }
  };

  // Update contact info elements
  const phoneElements = document.querySelectorAll('.contact-phone');
  phoneElements.forEach(el => el.textContent = contactInfo.phone);

  const emailElements = document.querySelectorAll('.contact-email');
  emailElements.forEach(el => {
    el.textContent = contactInfo.email;
    if (el.tagName === 'A') {
      el.href = `mailto:${contactInfo.email}`;
    }
  });

  const addressElements = document.querySelectorAll('.contact-address');
  addressElements.forEach(el => {
    el.innerHTML = `
      ${contactInfo.address.street}<br>
      ${contactInfo.address.city}, ${contactInfo.address.state} ${contactInfo.address.zipCode}
    `;
  });

  // Business hours
  const hoursElement = document.querySelector('.business-hours');
  if (hoursElement) {
    hoursElement.innerHTML = `
      <h6>Business Hours</h6>
      <ul class="list-unstyled">
        <li><strong>Monday - Friday:</strong> ${contactInfo.hours.monday}</li>
        <li><strong>Saturday:</strong> ${contactInfo.hours.saturday}</li>
        <li><strong>Sunday:</strong> ${contactInfo.hours.sunday}</li>
      </ul>
    `;
  }
}

// FAQ Section
function initializeFAQ() {
  const faqData = [
    {
      question: "What are your shipping options and costs?",
      answer: "We offer free shipping on orders over $50. For orders under $50, standard shipping is $9.99. Express shipping (2-3 business days) is available for $19.99. Orders are typically processed within 1-2 business days."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unopened products in original packaging. Opened products can be returned within 15 days if you're not satisfied. Return shipping costs are the responsibility of the customer unless the item was defective."
    },
    {
      question: "Are your supplements third-party tested?",
      answer: "Yes, all ProFit supplements undergo rigorous third-party testing for purity, potency, and safety. We work with certified laboratories to ensure our products meet the highest quality standards."
    },
    {
      question: "How should I store my supplements?",
      answer: "Store supplements in a cool, dry place away from direct sunlight. Keep containers tightly sealed and away from moisture. Most supplements should be stored at room temperature unless otherwise specified."
    },
    {
      question: "Can I take multiple supplements together?",
      answer: "Many supplements can be safely combined, but we recommend consulting with a healthcare professional before starting any new supplement regimen, especially if you're taking medications or have health conditions."
    },
    {
      question: "Do you offer bulk or wholesale pricing?",
      answer: "Yes, we offer wholesale pricing for gyms, fitness centers, and bulk orders. Please contact our sales team at wholesale@profitsupplements.com for more information about our business programs."
    }
  ];

  const faqContainer = document.getElementById('faqContainer');
  if (faqContainer) {
    const faqHTML = faqData.map((faq, index) => `
      <div class="card mb-3">
        <div class="card-header">
          <h6 class="mb-0">
            <button class="btn btn-link text-decoration-none w-100 text-start collapsed" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#faq${index}" 
                    aria-expanded="false">
              <i class="fas fa-chevron-down me-2"></i>
              ${faq.question}
            </button>
          </h6>
        </div>
        <div id="faq${index}" class="collapse" data-bs-parent="#faqContainer">
          <div class="card-body">
            ${faq.answer}
          </div>
        </div>
      </div>
    `).join('');

    faqContainer.innerHTML = faqHTML;

    // Add rotation animation to chevron icons
    faqContainer.addEventListener('shown.bs.collapse', function(e) {
      const button = e.target.previousElementSibling.querySelector('button i');
      if (button) button.style.transform = 'rotate(180deg)';
    });

    faqContainer.addEventListener('hidden.bs.collapse', function(e) {
      const button = e.target.previousElementSibling.querySelector('button i');
      if (button) button.style.transform = 'rotate(0deg)';
    });
  }
}

// Live Chat Widget (Placeholder)
function initializeLiveChat() {
  const liveChatBtn = document.getElementById('liveChatBtn');
  
  if (liveChatBtn) {
    liveChatBtn.addEventListener('click', function() {
      // This would integrate with a real chat service like Zendesk, Intercom, etc.
      showMessage('Live chat feature coming soon! Please use the contact form for now.', 'info');
    });
  }
}

// Contact Form Validation
function addContactFormValidation() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  // Real-time validation
  const inputs = contactForm.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });

    input.addEventListener('input', function() {
      // Clear previous validation state
      this.classList.remove('is-valid', 'is-invalid');
      const feedback = this.parentNode.querySelector('.invalid-feedback');
      if (feedback) feedback.remove();
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    // Check required fields
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = `${field.getAttribute('data-name') || field.name} is required`;
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
      const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phonePattern.test(value.replace(/[\s\-\(\)]/g, ''))) {
        isValid = false;
        message = 'Please enter a valid phone number';
      }
    }

    // Message length validation
    if (field.name === 'message' && value) {
      if (value.length < 20) {
        isValid = false;
        message = 'Message must be at least 20 characters long';
      } else if (value.length > 2000) {
        isValid = false;
        message = 'Message cannot exceed 2000 characters';
      }
    }

    // Update field state
    field.classList.remove('is-valid', 'is-invalid');
    const existingFeedback = field.parentNode.querySelector('.invalid-feedback');
    if (existingFeedback) existingFeedback.remove();

    if (value) { // Only validate if field has content
      if (isValid) {
        field.classList.add('is-valid');
      } else {
        field.classList.add('is-invalid');
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = message;
        field.parentNode.appendChild(feedback);
      }
    }

    return isValid;
  }
}

// Character counter for message field
function addMessageCharacterCounter() {
  const messageField = document.querySelector('textarea[name="message"]');
  if (!messageField) return;

  const counter = document.createElement('small');
  counter.className = 'text-muted mt-1 d-block';
  counter.id = 'messageCounter';
  messageField.parentNode.appendChild(counter);

  function updateCounter() {
    const length = messageField.value.length;
    const maxLength = 2000;
    counter.textContent = `${length}/${maxLength} characters`;
    
    if (length > maxLength * 0.9) {
      counter.className = 'text-warning mt-1 d-block';
    } else if (length >= maxLength) {
      counter.className = 'text-danger mt-1 d-block';
    } else {
      counter.className = 'text-muted mt-1 d-block';
    }
  }

  messageField.addEventListener('input', updateCounter);
  updateCounter(); // Initial count
}

// Initialize all contact functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeContactForm();
  initializeNewsletterForm();
  displayContactInfo();
  initializeFAQ();
  initializeLiveChat();
  addContactFormValidation();
  addMessageCharacterCounter();
});

// Export functions for global access
window.initializeContactForm = initializeContactForm;
window.initializeNewsletterForm = initializeNewsletterForm;