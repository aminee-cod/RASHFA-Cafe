// ==========================================================================
// RASHFA — Shared utilities (toast, confirm modal, cart badge, bottom nav)
// ==========================================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  // Map types to labels and icons
  const typeMap = {
    success: { icon: 'fa-check-circle', title: 'Success' },
    error: { icon: 'fa-exclamation-circle', title: 'Error' },
    info: { icon: 'fa-info-circle', title: 'Info' },
    warning: { icon: 'fa-triangle-exclamation', title: 'Warning' }
  };

  const config = typeMap[type] || typeMap.info;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${config.icon}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${config.title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close notification"><i class="fas fa-times"></i></button>
  `;

  container.appendChild(toast);

  // Close button
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    removeToast(toast);
  });

  // Auto-remove after 4 seconds
  const timeoutId = setTimeout(() => {
    removeToast(toast);
  }, 4000);

  // Store timeout id to clear if manually closed
  toast.dataset.timeoutId = timeoutId;
}

function removeToast(toast) {
  if (toast.dataset.removing) return;
  toast.dataset.removing = 'true';

  clearTimeout(parseInt(toast.dataset.timeoutId));

  toast.style.animation = 'toastSlideOut 0.3s ease forwards';
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 350);
}

function showConfirmModal(options) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('modalOverlay');
    const icon = document.getElementById('modalIcon');
    const title = document.getElementById('modalTitle');
    const message = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('modalConfirm');
    const cancelBtn = document.getElementById('modalCancel');

    icon.className = `modal-icon ${options.type || 'info'}`;
    icon.innerHTML = `<i class="fas ${options.icon || 'fa-question-circle'}"></i>`;
    title.textContent = options.title || 'Confirm';
    message.textContent = options.message || 'Are you sure you want to proceed?';
    confirmBtn.textContent = options.confirmText || 'Confirm';
    cancelBtn.textContent = options.cancelText || 'Cancel';
    confirmBtn.className = options.type === 'danger' ? 'btn-modal danger' : 'btn-modal confirm';

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    const cleanup = () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      confirmBtn.removeEventListener('click', handleConfirm);
      cancelBtn.removeEventListener('click', handleCancel);
      overlay.removeEventListener('click', handleOverlayClick);
    };
    const handleConfirm = () => { cleanup(); resolve(true); };
    const handleCancel = () => { cleanup(); resolve(false); };
    const handleOverlayClick = (e) => { if (e.target === overlay) { cleanup(); resolve(false); } };

    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
    overlay.addEventListener('click', handleOverlayClick);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('rashfaCart')) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => { el.textContent = count; });
  // Update bottom nav badge if exists
  const badge = document.querySelector('.mobile-bottom-nav .nav-item[data-page="cart"] .nav-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function initBottomNav() {
  const nav = document.getElementById('mobileBottomNav');
  if (!nav) return;

  // Highlight active page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('.nav-item').forEach(item => {
    const page = item.dataset.page;
    if (page === 'index' && currentPage === 'index.html') item.classList.add('active');
    else if (page === 'menu' && currentPage === 'menu.html') item.classList.add('active');
    else if (page === 'cart' && currentPage === 'cart.html') item.classList.add('active');
    else if (page === 'reservations' && currentPage === 'reservations.html') item.classList.add('active');
    else if (page === 'reviews' && currentPage === 'reviews.html') item.classList.add('active');
    else if (page === 'index' && currentPage === '') item.classList.add('active');
  });

  // Update cart badge
  updateCartCount();
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initBottomNav();
  initBackToTop();
});

window.showToast = showToast;
window.showConfirmModal = showConfirmModal;
window.escapeHtml = escapeHtml;
window.updateCartCount = updateCartCount;
