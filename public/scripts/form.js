window.addEventListener('DOMContentLoaded', function () {
  //取得
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');

  //トークンの生成
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

  //入力チェック
  const inputs = form.querySelectorAll("input[required], textarea[required]"); // 必須項目を取得

  function checkInputs() {
    let allFilled = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        allFilled = false;
      }
    });
    btn.disabled = !allFilled;
  }

  // 初回チェック
  checkInputs();

  // 入力イベントを監視
  inputs.forEach(input => {
    input.addEventListener("input", checkInputs);
  });
});
