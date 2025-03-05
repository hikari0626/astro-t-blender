// メニュー展開時に背景を固定
const backgroundFix = (bool) => {
  const scrollingElement = () => {
    const browser = window.navigator.userAgent.toLowerCase();
    if ("scrollingElement" in document) return document.scrollingElement;
    return document.documentElement;
  };

  const scrollY = bool
    ? scrollingElement().scrollTop
    : parseInt(document.body.style.top || "0");

  const fixedStyles = {
    height: "100vh",
    position: "fixed",
    top: `${scrollY * -1}px`,
    left: "0",
    width: "100vw"
  };

  Object.keys(fixedStyles).forEach((key) => {
    document.body.style[key] = bool ? fixedStyles[key] : "";
  });

  if (!bool) {
    window.scrollTo(0, scrollY * -1);
  }
};

// 変数定義
const CLASS = "-active";
let headerMenuFlg = false;

let hamburger = document.getElementById("js-hamburger");
let focusTrap = document.getElementById("js-focus-trap");
let menu = document.querySelector(".js-nav-area");

// メニュー開閉制御
//ハンバーガーボタンが選択されたら
hamburger.addEventListener("click", (e) => { 
  e.currentTarget.classList.toggle(CLASS);
  menu.classList.toggle(CLASS);
  if (headerMenuFlg) {// headerMenuFlgの状態で制御内容を切り替え
    backgroundFix(false);
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.focus();
    headerMenuFlg = false;
  } else {
    backgroundFix(true);
    hamburger.setAttribute("aria-expanded", "true");
    headerMenuFlg = true;
  }
});

//escキー押下でメニューを閉じられるように
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (headerMenuFlg) {
      hamburger.classList.remove(CLASS);
      menu.classList.remove(CLASS);
      backgroundFix(false);
      hamburger.focus();
      hamburger.setAttribute("aria-expanded", "false");
      headerMenuFlg = false;
    }
  }
});
// フォーカストラップ制御
focusTrap.addEventListener("focus", (e) => {
  hamburger.focus();
});


window.addEventListener('load', function () {
  // header
  const header = document.querySelector('.l-header');
  if (header) {
    // 初期状態のチェック
    if (window.scrollY > 0) {
      header.classList.add('-active');
    }

    // スクロールイベントのリスナーを追加
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        header.classList.add('-active');
      } else {
        header.classList.remove('-active');
      }
    });
  }

  /*-- スムーススクロール --*/
  const smoothScrollTrigger = document.querySelectorAll('a[href^="#"]');
  let headerH = document.querySelector('header').offsetHeight;
  //ページ内
  for (let i = 0; i < smoothScrollTrigger.length; i++) {
    smoothScrollTrigger[i].addEventListener('click', (e) => {
        e.preventDefault();
        let href = smoothScrollTrigger[i].getAttribute('href');
        let targetElement = document.getElementById(href.replace('#', ''));
        const rect = targetElement.getBoundingClientRect().top;
        const offset = window.pageYOffset;
        const target = rect + offset - headerH;
        window.scrollTo({
            top: target,
            behavior: 'smooth',
        });
    });
  }
  //ページ外
  const urlHash = location.hash;
  if (urlHash) {
    const urlTarget = document.getElementById(urlHash.replace('#', ''));
    if (urlTarget) {
      if (window.innerWidth > 1024) {
        headerH = 100;
      }
      const urlPosition = window.pageYOffset + urlTarget.getBoundingClientRect().top - headerH;
      window.scroll({
        top: urlPosition,
        behavior: 'auto'
      });
    };
  }

  // ページトップボタン
  const pageTopBtn = document.querySelector('#js-pageTop');
  if (pageTopBtn) {
    pageTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });

    // 初期状態のチェック
    if (window.scrollY > 0 && window.innerHeight + window.scrollY < document.body.offsetHeight) {
      pageTopBtn.classList.add('-active');
    }

    // スクロールイベントリスナーの追加
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0 && window.innerHeight + window.scrollY < document.body.offsetHeight) {
        pageTopBtn.classList.add('-active');
      } else {
        pageTopBtn.classList.remove('-active');
      }
    });
  }

  //ページ共通アニメーション
  const createCommonObserver = (targetSelector, rootMargin) => {
    const targets = document.querySelectorAll(targetSelector);
    const intersectionCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('-active');
        }
      });
    };
    const options = {
      rootMargin: rootMargin,
    };
    const observer = new IntersectionObserver(intersectionCallback, options);
    targets.forEach((target) => {
      observer.observe(target); // 各ターゲット要素を監視
    });
  };
  // class設定
  createCommonObserver('.js-fadeIn', '-20% 0px -10% 0px');
  createCommonObserver('.js-list', '-20% 0px -10% 0px');
  createCommonObserver('.js-swiperSlide', '-20% 0px -10% 0px');
  createCommonObserver('.js-swiperFadeIn', '-20% 0px -10% 0px');

  // .js-listの子要素を順番に遅らせる関数
  function delayJsList() {
    let listContainers = document.querySelectorAll(".js-list");
    listContainers.forEach((listContainer) => {
      let listChildren = listContainer.children;
      let delay = 0; // リセット
      for (let i = 0; i < listChildren.length; i++) {
        listChildren[i].style.transitionDelay = `${delay}s`;
        delay += 0.2; // 遅延の再設定
      }
    });
  }
  delayJsList();

  // .js-swiperSlide 内の .swiper-slide 要素を順番に遅らせる関数
  function delayJsSwiperSlide() {
    let listContainers = document.querySelectorAll(".js-swiperSlide");
    listContainers.forEach((listContainer) => {
      let swiperSlides = listContainer.querySelectorAll('.swiper-slide');
      let delay = 0; // リセット

      swiperSlides.forEach((swiperSlide) => {
        swiperSlide.style.transitionDelay = `${delay}s`;
        delay += 0.2; // 遅延の再設定
      });
    });
  }
  // 関数を呼び出して実行
  delayJsSwiperSlide();

});

// ビューポート固定する
!(function () {
  const viewport = document.querySelector('meta[name="viewport"]');
  function initializeViewportSwitch(fixedWidth) {
    function switchViewport() {
      const value =
        window.outerWidth > fixedWidth
          ? 'width=device-width,initial-scale=1'
          : `width=${fixedWidth}`;
      if (viewport.getAttribute('content') !== value) {
        viewport.setAttribute('content', value);
      }
    }
    addEventListener('resize', switchViewport, false);
    switchViewport();
  }
  // 初期化時に固定幅を指定
  initializeViewportSwitch(390);
})();
