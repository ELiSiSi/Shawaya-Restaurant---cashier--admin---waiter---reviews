// Base URL
const BASE_URL = window.location.origin;

// عرض رسائل النجاح/الفشل
function showMessage(message, type = 'success') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message-notification ${type}`;
  messageDiv.textContent = message;

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.classList.add('show');
  }, 100);

  setTimeout(() => {
    messageDiv.classList.remove('show');
    setTimeout(() => messageDiv.remove(), 300);
  }, 3000);
}

// نافذة تأكيد مخصصة
function showConfirmModal(message, onConfirm) {
  const modal = document.createElement('div');
  modal.className = 'confirm-modal';
  modal.innerHTML = `
    <div class="confirm-content">
      <div class="confirm-icon">⚠️</div>
      <h3>تأكيد الحذف</h3>
      <p>${message}</p>
      <div class="confirm-actions">
        <button class="btn-confirm-delete" onclick="confirmDelete(true)">حذف</button>
        <button class="btn-confirm-cancel" onclick="confirmDelete(false)">إلغاء</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);

  window.confirmCallback = onConfirm;
}

function confirmDelete(result) {
  const modal = document.querySelector('.confirm-modal');
  modal.classList.remove('show');
  setTimeout(() => modal.remove(), 300);

  if (result && window.confirmCallback) {
    window.confirmCallback();
  }
  window.confirmCallback = null;
}

// إضافة Event Listeners عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function () {
  // إضافة listeners للأزرار
  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', function () {
      const action = this.getAttribute('data-action');
      const id = this.getAttribute('data-id');

      if (action === 'deleteMeal') {
        showConfirmModal('هل أنت متأكد من حذف هذا المنتج؟', () =>
          deleteMeal(id)
        );
      } else if (action === 'deleteOffer') {
        showConfirmModal('هل أنت متأكد من حذف هذا العرض؟', () =>
          deleteOffer(id)
        );
      } else if (action === 'editMeal') {
        const row = this.closest('tr');
        const meal = JSON.parse(row.getAttribute('data-meal'));
        showEditMealForm(meal);
      } else if (action === 'editOffer') {
        const row = this.closest('tr');
        const offer = JSON.parse(row.getAttribute('data-offer'));
        showEditOfferForm(offer);
      }
    });
  });
});

// حذف منتج
async function deleteMeal(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/meal/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      showMessage('تم حذف المنتج بنجاح', 'success');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      const error = await response.json();
      showMessage(error.message || 'فشل حذف المنتج', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('حدث خطأ أثناء الحذف', 'error');
  }
}

// حذف عرض
async function deleteOffer(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/offer/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      showMessage('تم حذف العرض بنجاح', 'success');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      const error = await response.json();
      showMessage(error.message || 'فشل حذف العرض', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('حدث خطأ أثناء الحذف', 'error');
  }
}

// إظهار نموذج التعديل للمنتج
function showEditMealForm(meal) {
  const modal = document.getElementById('editMealModal');
  document.getElementById('editMealId').value = meal._id;
  document.getElementById('editMealName').value = meal.name;
  document.getElementById('editMealCategory').value = meal.category;
  document.getElementById('editMealPrice').value = meal.price;
  document.getElementById('editMealDescription').value = meal.description || '';
  document.getElementById('editMealImage').value = meal.image || '';

  // عرض الصورة الحالية
  const preview = document.getElementById('editMealImagePreview');
  if (meal.image) {
    preview.src = meal.image;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }

  modal.style.display = 'flex';
}

// إظهار نموذج التعديل للعرض
function showEditOfferForm(offer) {
  const modal = document.getElementById('editOfferModal');
  document.getElementById('editOfferId').value = offer._id;
  document.getElementById('editOfferTitle').value = offer.name;
  document.getElementById('editOfferPrice').value = offer.price;
  document.getElementById('editOfferNewPrice').value = offer.newprice || '';
  document.getElementById('editOfferDescription').value =
    offer.description || '';
  document.getElementById('editOfferImage').value = offer.image || '';

  // عرض الصورة الحالية
  const preview = document.getElementById('editOfferImagePreview');
  if (offer.image) {
    preview.src = offer.image;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }

  modal.style.display = 'flex';
}

// إغلاق النوافذ المنبثقة
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// تحديث صورة المعاينة
function updateImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (input.value) {
    preview.src = input.value;
    preview.style.display = 'block';
    preview.onerror = function () {
      this.style.display = 'none';
      showMessage('رابط الصورة غير صحيح', 'error');
    };
  } else {
    preview.style.display = 'none';
  }
}

// تحديث منتج
async function updateMeal(event) {
  event.preventDefault();

  const id = document.getElementById('editMealId').value;
  const data = {
    name: document.getElementById('editMealName').value,
    category: document.getElementById('editMealCategory').value,
    price: parseFloat(document.getElementById('editMealPrice').value),
    description: document.getElementById('editMealDescription').value,
    image: document.getElementById('editMealImage').value,
  };

  try {
    const response = await fetch(`${BASE_URL}/api/v1/meal/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      showMessage('تم تحديث المنتج بنجاح', 'success');
      closeModal('editMealModal');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      const error = await response.json();
      showMessage(error.message || 'فشل تحديث المنتج', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('حدث خطأ أثناء التحديث', 'error');
  }
}

// تحديث عرض
async function updateOffer(event) {
  event.preventDefault();

  const id = document.getElementById('editOfferId').value;
  const data = {
    name: document.getElementById('editOfferTitle').value,
    price: parseFloat(document.getElementById('editOfferPrice').value),
    description: document.getElementById('editOfferDescription').value,
    image: document.getElementById('editOfferImage').value,
  };

  // إضافة newprice فقط إذا كان موجود
  const newPrice = document.getElementById('editOfferNewPrice').value;
  if (newPrice) {
    data.newprice = parseFloat(newPrice);
  }

  try {
    const response = await fetch(`${BASE_URL}/api/v1/offer/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      showMessage('تم تحديث العرض بنجاح', 'success');
      closeModal('editOfferModal');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      const error = await response.json();
      showMessage(error.message || 'فشل تحديث العرض', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('حدث خطأ أثناء التحديث', 'error');
  }
}

// إضافة منتج جديد
async function addMeal(event) {
  event.preventDefault();

  const data = {
    name: document.getElementById('addMealName').value,
    category: document.getElementById('addMealCategory').value.trim(),
    price: parseFloat(document.getElementById('addMealPrice').value),
    description: document.getElementById('addMealDescription').value,
    image: document.getElementById('addMealImage').value,
  };

  try {
    const response = await fetch(`${BASE_URL}/api/v1/meal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      showMessage('تم إضافة المنتج بنجاح', 'success');
      closeModal('addMealModal');
      document.getElementById('addMealForm').reset();
      document.getElementById('addMealImagePreview').style.display = 'none';
      setTimeout(() => window.location.reload(), 1500);
    } else {
      const error = await response.json();
      showMessage(error.message || 'فشل إضافة المنتج', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('حدث خطأ أثناء الإضافة', 'error');
  }
}

// إضافة عرض جديد
async function addOffer(event) {
  event.preventDefault();

  const data = {
    name: document.getElementById('addOfferTitle').value,
    price: parseFloat(document.getElementById('addOfferPrice').value),
    description: document.getElementById('addOfferDescription').value,
    image: document.getElementById('addOfferImage').value,
  };

  // إضافة newprice فقط إذا كان موجود
  const newPrice = document.getElementById('addOfferNewPrice').value;
  if (newPrice) {
    data.newprice = parseFloat(newPrice);
  }

  try {
    const response = await fetch(`${BASE_URL}/api/v1/offer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      showMessage('تم إضافة العرض بنجاح', 'success');
      closeModal('addOfferModal');
      document.getElementById('addOfferForm').reset();
      document.getElementById('addOfferImagePreview').style.display = 'none';
      setTimeout(() => window.location.reload(), 1500);
    } else {
      const error = await response.json();
      showMessage(error.message || 'فشل إضافة العرض', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('حدث خطأ أثناء الإضافة', 'error');
  }
}

// عرض فاتورة الطلب
async function showOrderInvoice(orderId) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/order/${orderId}`);

    if (!response.ok) {
      throw new Error('فشل في جلب بيانات الطلب');
    }

    const orderData = await response.json();
    const order = orderData?.data?.data || orderData?.data || orderData;

    // تحديد حالة الطلب بالعربي
    const statusMap = {
      pending: 'قيد التنفيذ',
      processing: 'جاري التحضير',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
      done: 'تم',
      cancel: 'ملغي',
    };

    const statusText = statusMap[order.status] || order.status || 'قيد التنفيذ';

    // تحديد لون الحالة
    const statusColors = {
      pending: 'background-color: #ffc107; color: #222;',
      processing: 'background-color: #0dcaf0; color: white;',
      delivered: 'background-color: #28a745; color: white;',
      cancelled: 'background-color: #dc3545; color: white;',
      done: 'background-color: #28a745; color: white;',
      cancel: 'background-color: #dc3545; color: white;',
    };

    const statusStyle =
      statusColors[order.status] || 'background-color: #6c757d; color: white;';

    // حساب الإجمالي الكلي
    const calculatedTotal =
      order.cart && order.cart.length > 0
        ? order.cart.reduce(
            (sum, item) => sum + (item.quantity || 1) * (item.price || 0),
            0
          )
        : order.total || 0;
    console.log('Order Status:', order.status);
    // إنشاء محتوى الفاتورة
    const invoiceHTML = `
      <div class="invoice-header">
        <h2>🍽️ شوية</h2>
        <p class="invoice-date">📅 التاريخ: ${new Date().toLocaleDateString(
          'ar-EG',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          }
        )}</p>
        <p class="invoice-number">رقم الطلب: #${order.numberOrder || 'غير متوفر'}</p>
      </div>

      <div class="invoice-section">
        <h3>📍 بيانات العميل</h3>
        <div class="invoice-row">
          <span class="label">الاسم :  </span>
          <span class="value">${order.name || 'غير محدد'}</span>
        </div>
        <div class="invoice-row">
          <span class="label"> الهاتف : </span>
          <span class="value">${order.number || 'غير محدد'}</span>
        </div>
        <div class="invoice-row">
          <span class="label">العنوان : </span>
          <span class="value">${order.address || 'غير محدد'}</span>
        </div>
      </div>

      <div class="invoice-section">
        <h3>🛒 تفاصيل الطلب</h3>
        <table class="invoice-table">
          <thead>
            <tr>
              <th>المنتج</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${
              order.cart && order.cart.length > 0
                ? order.cart
                    .map(
                      (item) => `
              <tr>
                <td>${item.name || 'غير محدد'}</td>
                <td>${item.quantity || 1}</td>
                <td>${(item.price || 0).toFixed(2)} جنيه</td>
                <td>${((item.quantity || 1) * (item.price || 0)).toFixed(2)} جنيه</td>
              </tr>
            `
                    )
                    .join('')
                : '<tr><td colspan="4" style="text-align:center; color:#999;">لا توجد عناصر في الطلب</td></tr>'
            }
          </tbody>
        </table>
      </div>

      <div class="invoice-footer">
        <div class="invoice-total">
          <span class="total-label">💰 الإجمالي الكلي :  </span>
          <span class="total-value">${calculatedTotal.toFixed(2)} جنيه</span>
        </div>
        <div class="invoice-status">
          <span class="label">حالة الطلب : </span>
          <span class="status-badge" style="${statusStyle} padding: 6px 14px; border-radius: 6px; font-weight: bold; display: inline-block;">${statusText}</span>
        </div>
      </div>

      <div class="invoice-notes">
        <p>🙏 شكراً لتعاملكم معنا</p>
        <p>نتمنى لكم تجربة ممتعة وطعام شهي</p>
      </div>
    `;

    document.getElementById('invoiceContent').innerHTML = invoiceHTML;
    document.getElementById('orderInvoiceModal').style.display = 'flex';
  } catch (error) {
    console.error('Error:', error);
    showMessage('فشل في تحميل بيانات الطلب', 'error');
  }
}

// حذف طلب واحد
async function deleteOrder(orderId) {
  showConfirmModal('هل أنت متأكد من حذف هذا الطلب؟', async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/order/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        showMessage('تم حذف الطلب بنجاح', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const error = await response.json();
        showMessage(error.message || 'فشل حذف الطلب', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('حدث خطأ أثناء الحذف', 'error');
    }
  });
}

// حذف جميع الطلبات
async function deleteAllOrders() {
  showConfirmModal(
    '⚠️ هل أنت متأكد من حذف جميع الطلبات؟ هذا الإجراء لا يمكن التراجع عنه!',
    async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/order`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          showMessage('تم حذف جميع الطلبات بنجاح', 'success');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          const error = await response.json();
          showMessage(error.message || 'فشل حذف الطلبات', 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        showMessage('حدث خطأ أثناء الحذف', 'error');
      }
    }
  );
}

// طباعة الفاتورة
function printInvoice() {
  const invoiceContent = document.getElementById('invoiceContent').innerHTML;
  const printWindow = window.open('', '_blank', 'width=800,height=600');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>فاتورة الطلب</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Cairo", sans-serif;
        }
        body {
          padding: 20px;
          background: white;
            text-align: right;

          color: #000;
        }
        .invoice-header {
          text-align: center;
          border-bottom: 3px solid #FF2400;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .invoice-header h2 {
          font-size: 32px;
          color: #FF2400;
          margin-bottom: 10px;
            text-align: right;

        }
        .invoice-date, .invoice-number {
          text-align: right;

          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }
        .invoice-section {
          text-align: right;

          margin: 25px 0;
          padding: 20px;
          border: 2px solid #eee;
          border-radius: 10px;
        }
        .invoice-section h3 {
          text-align: right;

          color: #FF2400;
          margin-bottom: 15px;
          font-size: 20px;
        }
.invoice-row {
  display: flex;
  justify-content: flex-start; /* الاسم من أول السطر */
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px dotted #ddd;
}



        .label {
          font-weight: bold;
            text-align: right;

          color: #333;
        }
        .value {
          color: #666;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .invoice-table th {
          background: #FF2400;
          color: white;
          padding: 12px;
          text-align: center;

        }
        .invoice-table td {
          padding: 12px;
          text-align: center;
          border-bottom: 1px solid #eee;
        }
        .invoice-footer {
          margin-top: 30px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 10px;

        }
        .invoice-total {
          display: flex;
          justify-content: space-between;
          font-size: 24px;
          font-weight: bold;
          color: #FF2400;
          margin-bottom: 15px;
             display: flex;
  justify-content: flex-start; /* الاسم من أول السطر */
  gap: 10px;
        }
        .invoice-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
             display: flex;
  justify-content: flex-start; /* الاسم من أول السطر */
  gap: 10px;
        }
        .status-badge {
          padding: 8px 20px;
          border-radius: 20px;
          background: #4CAF50;
          color: white;
          font-weight: bold;
        }
        .invoice-notes {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px dashed #ccc;
          color: #666;

        }
        .invoice-notes p {
          margin: 5px 0;
        }
        @media print {
          body {
            padding: 0;
          }
          .invoice-section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      ${invoiceContent}
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 500);
}

// فتح نافذة الإضافة
function openAddMealModal() {
  document.getElementById('addMealModal').style.display = 'flex';
}

function openAddOfferModal() {
  document.getElementById('addOfferModal').style.display = 'flex';
}

// إغلاق النافذة عند الضغط خارجها
window.onclick = function (event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // إغلاق نافذة التأكيد
  if (event.target.classList.contains('confirm-modal')) {
    confirmDelete(false);
  }
};
