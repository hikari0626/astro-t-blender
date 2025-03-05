//トークンの生成
window.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  const siteKey = "6LfDyecqAAAAAGzsP3_W1R_fX_zwPFNnyj-MBo7w"; // Astro の環境変数から取得

  if (!form || !btn) return; // 要素が存在しない場合は処理しない

  grecaptcha.ready(function() {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      grecaptcha.execute(siteKey, { action: 'submit' }).then(function (token) {
        document.getElementById('g-recaptcha-response').value = token;
        form.submit();
      });
    });
  });
});