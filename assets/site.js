/* Wen academic site — shared language switch
   Default language is ALWAYS English.
   A click on 中文 is remembered only for the current browser session
   (sessionStorage), so it survives moving between index.html and
   paper.html, but a brand-new visit always opens in English again. */
(function () {
  var KEY = 'wen-site-lang';
  var root = document.documentElement;

  function apply(lang) {
    lang = (lang === 'zh') ? 'zh' : 'en';
    root.setAttribute('data-lang', lang);
    root.lang = (lang === 'zh') ? 'zh-Hans' : 'en';
    var be = document.getElementById('btn-en'), bz = document.getElementById('btn-zh');
    if (be) be.setAttribute('aria-pressed', lang === 'en');
    if (bz) bz.setAttribute('aria-pressed', lang === 'zh');
    try { sessionStorage.setItem(KEY, lang); } catch (e) {}
  }

  var saved = null;
  try { saved = sessionStorage.getItem(KEY); } catch (e) {}
  if (saved !== 'zh' && saved !== 'en') saved = 'en';

  /* drop the old long-term preference so a previously saved "zh" cannot win */
  try { localStorage.removeItem(KEY); } catch (e) {}

  apply(saved);

  var be2 = document.getElementById('btn-en'), bz2 = document.getElementById('btn-zh');
  if (be2) be2.addEventListener('click', function () { apply('en'); });
  if (bz2) bz2.addEventListener('click', function () { apply('zh'); });
})();
