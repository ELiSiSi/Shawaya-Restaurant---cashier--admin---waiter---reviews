// ================== LocalStorage Keys ==================
const CART_KEY = 'yakebda_cart';

// ================== Global Cart ==================
let cart = [];

// ================== XSS Protection ==================
function escapeHTML(str = '') {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ================== Load Cart ==================
function loadCart() {
  try {
    const savedCart = localStorage.getItem(CART_KEY);
    cart = savedCart ? JSON.parse(savedCart) : [];
  } catch {
    cart = [];
    localStorage.removeItem(CART_KEY);
  }

  updateCartCount();

  if (document.getElementById('cartItems')) {
    displayCartItems();
  }
}

// ================== Save Cart ==================
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

// ================== Add To Cart ==================
function addToCart(name, price, image) {
  if (isNaN(price) || price <= 0) return;

  const cleanedName = escapeHTML(name);
  const cleanedImage = escapeHTML(image);

  const item = cart.find((i) => i.name === cleanedName);

  if (item) item.quantity++;
  else {
    cart.push({
      name: cleanedName,
      price: Number(price),
      image: cleanedImage,
      quantity: 1,
    });
  }

  saveCart();
  showNotification(`تم إضافة ${cleanedName} للسلة ✓`);
}

// ================== Cart Count ==================
function updateCartCount() {
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  document.querySelectorAll('.cart-count').forEach((el) => {
    el.textContent = total;
  });
}

// ================== Display Cart ==================
function displayCartItems() {
  const container = document.getElementById('cartItems');
  const empty = document.getElementById('emptyCart');
  const content = document.getElementById('cartContent');

  if (!container) return;

  container.innerHTML = '';

  if (!cart.length) {
    empty && (empty.style.display = 'block');
    content && (content.style.display = 'none');
    updateCartSummary();
    return;
  }

  empty && (empty.style.display = 'none');
  content && (content.style.display = 'grid');

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.index = index;

    div.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>

      <div class="cart-item-details">
        <div class="cart-item-header">
          <h3>${item.name}</h3>
          <button type="button" class="btn-remove" data-action="remove">حذف</button>
        </div>
        <div class="cart-item-footer">
          <div class="quantity-controls">
            <button type="button" class="qty-btn" data-action="decrease">-</button>
            <span class="quantity">${item.quantity}</span>
            <button type="button" class="qty-btn" data-action="increase">+</button>
          </div>
          <div class="item-price">${item.price * item.quantity} جنيه</div>
        </div>
      </div>
    `;

    container.appendChild(div);
  });

  updateCartSummary();
}

// ================== Quantity / Remove ==================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.qty-btn, .btn-remove');
  if (!btn) return;

  const itemDiv = btn.closest('.cart-item');
  const index = Number(itemDiv.dataset.index);

  if (btn.dataset.action === 'increase') cart[index].quantity++;
  if (btn.dataset.action === 'decrease') {
    cart[index].quantity > 1 ? cart[index].quantity-- : cart.splice(index, 1);
  }
  if (btn.dataset.action === 'remove') cart.splice(index, 1);

  saveCart();
  displayCartItems();
});

// ================== Cart Summary ==================
function updateCartSummary() {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = `${val} جنيه`;
  };

  set('subtotal', total);
  set('total', total);
}

// ================== Filter Products ==================
function filterProducts(category) {
  document.querySelectorAll('.product-card').forEach((card) => {
    card.style.display =
      category === 'all' || card.dataset.category === category
        ? 'block'
        : 'none';
  });
}

// ================== Tabs + Add to Cart (NO inline JS) ==================
document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('.btn-add-cart');
  if (addBtn) {
    addToCart(addBtn.dataset.name, addBtn.dataset.price, addBtn.dataset.image);
  }

  const tab = e.target.closest('.tab-btn');
  if (tab) {
    document
      .querySelectorAll('.tab-btn')
      .forEach((b) => b.classList.remove('active'));
    tab.classList.add('active');
    filterProducts(tab.dataset.filter);
  }
});

// ================== Notification Function ==================
function showNotification(msg, type = 'success') {
  const div = document.createElement('div');
  div.textContent = msg;

  const bgColor = type === 'error' ? '#e74c3c' : '#2ecc71';

  div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 30px;
    border-radius: 8px;
    background: ${bgColor};
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(div);
  setTimeout(() => {
    div.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => div.remove(), 300);
  }, 3000);
}

// ================== Loading Spinner ==================
function showLoading(show = true) {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.style.display = show ? 'flex' : 'none';
  }
}

// ================== Clear Cart ==================
function clearCart() {
  cart = [];
  localStorage.removeItem(CART_KEY);
  updateCartCount();
  displayCartItems();
}

// ================== Close Modal ==================
function closeModal() {
  document.getElementById('successModal')?.classList.remove('show');
  window.location.href = '/menu';
}

// ================== Form Validation ==================
function validateForm() {
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();

  // التحقق من الاسم
  if (!name) {
    showNotification('❌ من فضلك أدخل الاسم الكامل', 'error');
    document.getElementById('customerName').focus();
    return false;
  }

  if (name.length < 3) {
    showNotification('❌ الاسم يجب أن يكون 3 أحرف على الأقل', 'error');
    document.getElementById('customerName').focus();
    return false;
  }

  // التحقق من رقم الهاتف
  if (!phone) {
    showNotification('❌ من فضلك أدخل رقم التليفون', 'error');
    document.getElementById('customerPhone').focus();
    return false;
  }

  // التحقق من صحة رقم الهاتف المصري
  if (!/^01[0125][0-9]{8}$/.test(phone)) {
    showNotification(
      '❌ رقم الهاتف غير صحيح! يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويكون 11 رقم',
      'error'
    );
    document.getElementById('customerPhone').focus();
    return false;
  }

  // التحقق من العنوان
  if (!address) {
    showNotification('❌ من فضلك أدخل العنوان بالتفصيل', 'error');
    document.getElementById('customerAddress').focus();
    return false;
  }

  if (address.length < 10) {
    showNotification(
      '❌ العنوان يجب أن يكون مفصل أكثر (10 أحرف على الأقل)',
      'error'
    );
    document.getElementById('customerAddress').focus();
    return false;
  }

  return true;
}

// ================== Checkout Function ==================
async function checkout(e) {
  e.preventDefault();

  // التحقق من السلة
  if (!cart.length) {
    showNotification('❌ السلة فارغة! أضف منتجات أولاً', 'error');
    return;
  }

  // التحقق من صحة البيانات
  if (!validateForm()) {
    return;
  }

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const notes = document.getElementById('notes')?.value.trim() || '';

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  // البيانات المطابقة للـ Schema
  const orderData = {
    name: name,
    number: phone,
    address: address,
    notes: notes,
    cart: cart,
    total: total,
  };

  try {
    // إظهار الـ Loading
    showLoading(true);

    // إرسال الطلب للـ API
    const response = await fetch('/api/v1/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    // إخفاء الـ Loading
    showLoading(false);

    if (response.ok) {
      // ✅ نجح الإرسال
      showNotification('✅ تم إرسال الطلب بنجاح!');

      // مسح السلة
      clearCart();

      // إظهار الـ Modal
      const modal = document.getElementById('successModal');
      if (modal) {
        modal.classList.add('show');

        // إخفاء الـ Modal بعد 3 ثواني والانتقال للقائمة
        setTimeout(() => {
          modal.classList.remove('show');
          window.location.href = '/menu';
        }, 3000);
      }
    } else {
      // ❌ فشل الإرسال
      throw new Error(data.message || 'حدث خطأ في إرسال الطلب');
    }
  } catch (error) {
    // إخفاء الـ Loading
    showLoading(false);

    // إظهار رسالة الخطأ
    showNotification(`❌ حدث خطأ في إرسال الطلب: ${error.message}`, 'error');
    console.error('Error:', error);
  }
}

// ================== Form Submit Event ==================
document.addEventListener('DOMContentLoaded', () => {
  loadCart();

  const form = document.getElementById('cartForm');
  if (form) {
    form.addEventListener('submit', checkout);
  }
});

// ================== CSS Animations ==================
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  /* Loading Spinner Styles */
  .loading-spinner {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid var(--primary-color, #ff6b35);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
