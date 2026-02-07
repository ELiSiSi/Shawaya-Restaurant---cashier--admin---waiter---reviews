document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const passwordInput = document.getElementById('password');

  loginBtn.addEventListener('click', () => {
    const password = passwordInput.value.trim();
    const errorDiv = document.querySelector('.error-message');

    // إزالة أي رسالة خطأ سابقة
    if (errorDiv) {
      errorDiv.remove();
    }

    if (!password) {
      // لو مفيش رقم مكتوب
      const div = document.createElement('div');
      div.className = 'error-message';
      div.textContent = 'من فضلك أدخل الرقم السري';
      passwordInput.parentNode.insertBefore(div, passwordInput.nextSibling);
      return;
    }

    // الرقم مكتوب → حوله للـ dashboard
    // السيرفر هيتحقق من الرقم السري
    window.location.href = `/admin/dashboard/${password}`;
  });
});
