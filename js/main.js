/**
 * ==========================================================================
 * PrintCraft Pro - Master JavaScript Logic
 * ==========================================================================
 * Pure Vanilla JavaScript implementation with zero external framework dependencies.
 * All event listeners are clean, decoupled, and attached via JS (no inline handlers).
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initBackToTop();
  initCalculator();
  initGalleryFilter();
  initFAQAccordion();
  initBlogModal();
  initContactForm();
  initNewsletterForm();
  initReviewForm();
  initTestimonialSlider();
});

/* ==========================================================================
   1. Navbar & Mobile Menu Navigation
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Toggle mobile navigation drawer
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!header?.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }

  // Active navigation highlight based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Smooth scrolling for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* ==========================================================================
   2. Scroll Animations (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('visible'));
  }
}

/* ==========================================================================
   3. Back To Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   4. Instant Print Quote Calculator
   ========================================================================== */
function initCalculator() {
  const productSelect = document.getElementById('calc-product');
  const paperSelect = document.getElementById('calc-paper');
  const qtyInput = document.getElementById('calc-qty');
  const finishingSelect = document.getElementById('calc-finish');
  const turnSelect = document.getElementById('calc-speed');
  const totalAmountEl = document.getElementById('calc-total');

  if (!productSelect || !totalAmountEl) return;

  function calculatePrice() {
    const baseProductPrice = parseFloat(productSelect.value || 0.10);
    const paperMultiplier = parseFloat(paperSelect?.value || 1);
    const quantity = parseInt(qtyInput?.value || 100, 10);
    const finishingAddon = parseFloat(finishingSelect?.value || 0);
    const speedMultiplier = parseFloat(turnSelect?.value || 1);

    let discount = 1;
    if (quantity >= 5000) discount = 0.65;
    else if (quantity >= 2500) discount = 0.75;
    else if (quantity >= 1000) discount = 0.85;
    else if (quantity >= 500) discount = 0.92;

    const unitPrice = (baseProductPrice * paperMultiplier) + finishingAddon;
    const rawTotal = (unitPrice * quantity * discount) * speedMultiplier;
    const finalTotal = Math.max(15, rawTotal);

    totalAmountEl.textContent = `$${finalTotal.toFixed(2)}`;
  }

  [productSelect, paperSelect, qtyInput, finishingSelect, turnSelect].forEach(element => {
    if (element) {
      element.addEventListener('input', calculatePrice);
      element.addEventListener('change', calculatePrice);
    }
  });

  calculatePrice();
}

/* ==========================================================================
   5. Gallery Filtering & Lightbox Modal
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modalOverlay = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.querySelector('.modal-close');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
            setTimeout(() => item.style.opacity = '1', 50);
          } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 300);
          }
        });
      });
    });
  }

  if (modalOverlay) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgObj = item.querySelector('img');
        const titleText = item.querySelector('h4')?.textContent || 'Print Sample';
        const descText = item.querySelector('p')?.textContent || 'High quality commercial print sample';

        if (modalImg) modalImg.src = imgObj ? imgObj.src : '';
        if (modalTitle) modalTitle.textContent = titleText;
        if (modalDesc) modalDesc.textContent = descText;

        modalOverlay.classList.add('active');
      });
    });

    const closeModal = () => modalOverlay.classList.remove('active');
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
}

/* ==========================================================================
   6. Searchable FAQ Accordion
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faq-search');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();

      faqItems.forEach(item => {
        const question = item.querySelector('.faq-header span')?.textContent.toLowerCase() || '';
        const answer = item.querySelector('.faq-body')?.textContent.toLowerCase() || '';

        if (question.includes(term) || answer.includes(term)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   7. Blog Article Modal Viewer
   ========================================================================== */
function initBlogModal() {
  const blogBtns = document.querySelectorAll('.read-blog-btn');
  const blogModal = document.getElementById('blog-modal');
  const blogModalTitle = document.getElementById('blog-modal-title');
  const blogModalBody = document.getElementById('blog-modal-body');
  const blogModalClose = document.getElementById('blog-modal-close');

  if (blogBtns.length > 0 && blogModal) {
    const articles = {
      'tips': {
        title: 'Essential Commercial Printing Tips for Business Owners',
        content: '<p>Discover how to optimize resolution, choose correct CMYK colors, add 3mm bleeds, and format vector fonts for razor-sharp commercial print runs.</p>'
      },
      'branding': {
        title: 'How Printed Collateral Builds Brand Equity in a Digital World',
        content: '<p>High-tactile printed stationery, luxury foil business cards, and custom packaging leave lasting physical brand impressions that digital ads cannot match.</p>'
      },
      'packaging': {
        title: 'The Art & Engineering of Custom Product Packaging Boxes',
        content: '<p>Learn about corrugated box fluting, folding cartons, structural die-lines, embossing, and soft-touch lamination for unboxing experiences.</p>'
      },
      'cards': {
        title: 'Business Cards That Close Deals: Paper Weights & Finishes',
        content: '<p>A comparison of 350gsm vs 400gsm stocks, Spot UV gloss highlights, edge painting, and metallic foil stamping for executive networking.</p>'
      },
      'marketing': {
        title: 'Designing High-Conversion Flyers & Promotional Brochures',
        content: '<p>Layout hierarchy, tri-fold vs bi-fold panel organization, call-to-action placement, and paper paper finishes for trade show marketing.</p>'
      },
      'trends': {
        title: 'Modern Print Design Trends: Eco-Inks, Minimalism & Foil',
        content: '<p>Explore sustainable FSC certified recycled papers, soy-based eco inks, minimalist typography, and warm rose gold metallic accents.</p>'
      }
    };

    blogBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const articleKey = btn.getAttribute('data-article') || 'tips';
        const articleData = articles[articleKey] || articles['tips'];

        if (blogModalTitle) blogModalTitle.textContent = articleData.title;
        if (blogModalBody) blogModalBody.innerHTML = articleData.content;

        blogModal.classList.add('active');
      });
    });

    const closeBlog = () => blogModal.classList.remove('active');

    if (blogModalClose) blogModalClose.addEventListener('click', closeBlog);
    blogModal.addEventListener('click', (e) => {
      if (e.target === blogModal) closeBlog();
    });
  }
}

/* ==========================================================================
   8. Contact Form & Drag-and-Drop File Upload
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const fileInput = document.getElementById('file-upload');
  const fileInfo = document.getElementById('file-info');
  const dropzone = document.getElementById('dropzone');
  const alertBox = document.getElementById('form-alert');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        updateFileInfo(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        updateFileInfo(fileInput.files[0]);
      }
    });

    function updateFileInfo(file) {
      if (fileInfo) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        fileInfo.innerHTML = `<i class="fas fa-file-pdf" style="color: var(--accent);"></i> Selected: <strong>${file.name}</strong> (${sizeMb} MB)`;
        fileInfo.style.display = 'block';
      }
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit Quote';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      }

      setTimeout(() => {
        if (alertBox) {
          alertBox.className = 'alert alert-success';
          alertBox.innerHTML = '<i class="fas fa-check-circle"></i> <strong>Message Sent Successfully!</strong> Our prepress team will contact you within 2 business hours.';
          alertBox.style.display = 'block';
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          alert('Thank you! Your quote request has been submitted successfully.');
        }

        form.reset();
        if (fileInfo) fileInfo.style.display = 'none';

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 1200);
    });
  }
}

/* ==========================================================================
   9. Newsletter Form Listener
   ========================================================================== */
function initNewsletterForm() {
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for subscribing to PrintCraft Pro insights!');
      form.reset();
    });
  });
}

/* ==========================================================================
   10. Review Submission Form Listener
   ========================================================================== */
function initReviewForm() {
  const openBtn = document.getElementById('open-review-modal');
  const reviewModal = document.getElementById('review-modal');
  const closeBtn = document.getElementById('review-modal-close');
  const reviewForm = document.getElementById('review-form');

  if (openBtn && reviewModal) {
    openBtn.addEventListener('click', () => reviewModal.classList.add('active'));

    const closeReview = () => reviewModal.classList.remove('active');
    if (closeBtn) closeBtn.addEventListener('click', closeReview);
    reviewModal.addEventListener('click', (e) => {
      if (e.target === reviewModal) closeReview();
    });

    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your feedback! Your review will be published following moderation.');
        closeReview();
        reviewForm.reset();
      });
    }
  }
}

/* ==========================================================================
   11. Testimonial Slider / Carousel
   ========================================================================== */
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.slider-slide');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let currentSlide = 0;

  if (slides.length === 0) return;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });
  }

  showSlide(0);
}
