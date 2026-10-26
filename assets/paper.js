/* Publication detail page renderer */
(function () {
  var el = document.getElementById('paper');
  if (!el) return;

  var P = window.PAPERS || {};
  var ORDER = window.PAPER_ORDER || [];
  var doi = null;
  try { doi = new URLSearchParams(location.search).get('doi'); } catch (e) {}
  if (!doi && location.hash) {
    try { doi = decodeURIComponent(location.hash.slice(1)); } catch (e2) {}
  }
  var d = doi ? P[doi] : null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function plain(s) {
    return String(s || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&')
      .replace(/&ndash;/g, '\u2013').replace(/&hellip;/g, '\u2026')
      .replace(/&rsquo;/g, '\u2019').replace(/&nbsp;/g, ' ');
  }

  if (!d) {
    el.outerHTML =
      '<div class="paper-missing">' +
      '<p style="font-size:17px;color:var(--text);margin-bottom:8px">' +
      '<span class="en">Publication not found</span><span class="zh">未找到该论文</span></p>' +
      '<p style="margin-bottom:22px"><span class="en">The link may be incomplete or the paper is no longer listed.</span>' +
      '<span class="zh">链接可能不完整，或该论文已不在列表中。</span></p>' +
      '<a class="backlink" href="index.html#publications" style="justify-content:center">' +
      '<svg class="ic" aria-hidden="true"><use href="#i-back"/></svg>' +
      '<span class="en">Back to publications</span><span class="zh">返回论文列表</span></a></div>';
    return;
  }

  var titlePlain = plain(d.title);
  document.title = titlePlain + ' — Xiewen Wen (Sitman) \u6e29\u71ee\u6587';
  var md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute('content', titlePlain.slice(0, 150) + ' — ' + plain(d.journal) + ', ' + d.year + '.');

  var badges = [];
  if (d.inPress) badges.push('<span class="badge">&middot; <span class="en">In press</span><span class="zh">\u5728\u520a</span></span>');
  if (d.oa) badges.push('<span class="oa">&middot; <span class="en">Open Access</span><span class="zh">\u5f00\u653e\u83b7\u53d6</span></span>');
  if (d.esi) badges.push('<span class="badge">&middot; <span class="en">ESI Highly Cited Paper</span><span class="zh">ESI \u9ad8\u88ab\u5f15\u8bba\u6587</span></span>');

  var pubUrl = 'https://doi.org/' + d.doi;
  var acts = '';
  if (d.pdf) {
    acts += '<a class="primary" href="' + esc(d.pdf) + '" target="_blank" rel="noopener">' +
            '<svg class="ic" aria-hidden="true"><use href="#i-download"/></svg>' +
            '<span class="en">Download PDF</span><span class="zh">\u4e0b\u8f7d PDF</span></a>';
    acts += '<a href="' + esc(pubUrl) + '" target="_blank" rel="noopener">' +
            '<svg class="ic" aria-hidden="true"><use href="#i-external"/></svg>' +
            '<span class="en">View at publisher</span><span class="zh">\u524d\u5f80\u51fa\u7248\u5546\u9875\u9762</span></a>';
  } else {
    acts += '<a class="primary" href="' + esc(pubUrl) + '" target="_blank" rel="noopener">' +
            '<svg class="ic" aria-hidden="true"><use href="#i-external"/></svg>' +
            '<span class="en">Read at publisher</span><span class="zh">\u524d\u5f80\u51fa\u7248\u5546\u9875\u9762\u9605\u8bfb</span></a>';
  }

  var absHtml;
  if (d.abstract) {
    absHtml = '<p class="abs">' + esc(d.abstract) + '</p>';
  } else {
    absHtml = '<p class="abs missing">' +
      '<span class="en">The abstract is not available in our records. Please open the publisher page to read it.</span>' +
      '<span class="zh">\u672c\u7ad9\u6682\u672a\u6536\u5f55\u8be5\u6587\u6458\u8981\uff0c\u8bf7\u524d\u5f80\u51fa\u7248\u5546\u9875\u9762\u67e5\u770b\u3002</span></p>';
  }

  var kwHtml = '';
  if (d.keywords && d.keywords.length) {
    kwHtml =
      '<div class="block"><h2><span class="h2ic"><svg class="ic" aria-hidden="true"><use href="#i-tag"/></svg></span>' +
      '<span class="en">Keywords</span><span class="zh">\u5173\u952e\u8bcd</span></h2>' +
      '<ul class="tags">' + d.keywords.map(function (k) { return '<li>' + esc(k) + '</li>'; }).join('') + '</ul></div>';
  }

  var hlHtml = d.hl ? '<div class="hlbox"><b><span class="en">Highlight:</span><span class="zh">\u4eae\u70b9\uff1a</span></b> ' + d.hl + '</div>' : '';

  var idx = ORDER.indexOf(doi);
  var prev = idx > 0 ? P[ORDER[idx - 1]] : null;
  var next = (idx >= 0 && idx < ORDER.length - 1) ? P[ORDER[idx + 1]] : null;
  var nav = '<div class="acts" style="margin-top:34px;padding-top:22px;border-top:1px solid var(--line)">';
  if (prev) nav += '<a href="paper.html?doi=' + encodeURIComponent(prev.doi) + '"><svg class="ic" aria-hidden="true"><use href="#i-back"/></svg>' +
                   '<span class="en">Newer</span><span class="zh">\u66f4\u65b0</span></a>';
  if (next) nav += '<a href="paper.html?doi=' + encodeURIComponent(next.doi) + '" style="margin-left:auto">' +
                   '<span class="en">Older</span><span class="zh">\u66f4\u65e9</span>' +
                   '<svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></a>';
  nav += '</div>';

  el.innerHTML =
    '<p class="kicker"><span class="yr">' + esc(d.year) + '</span>' +
      '<span class="en">Journal article</span><span class="zh">\u671f\u520a\u8bba\u6587</span></p>' +
    '<h1>' + d.title + '</h1>' +
    '<p class="authors">' + d.authors + '</p>' +
    '<p class="cite"><span class="jn">' + d.journal + '</span> ' + d.cite +
      (badges.length ? ' ' + badges.join(' ') : '') + '</p>' +
    hlHtml +
    '<div class="acts">' + acts + '</div>' +
    '<div class="block"><h2><span class="h2ic"><svg class="ic" aria-hidden="true"><use href="#i-doc"/></svg></span>' +
      '<span class="en">Abstract</span><span class="zh">\u6458\u8981</span></h2>' + absHtml + '</div>' +
    kwHtml +
    '<p class="note"><span class="en">DOI: <a href="' + esc(pubUrl) + '" target="_blank" rel="noopener">' + esc(d.doi) + '</a></span>' +
      '<span class="zh">DOI\uff1a<a href="' + esc(pubUrl) + '" target="_blank" rel="noopener">' + esc(d.doi) + '</a></span>' +
      '<br><span class="en">* Corresponding author &nbsp;&middot;&nbsp; # Equal contribution</span>' +
      '<span class="zh">* \u901a\u8baf\u4f5c\u8005 &nbsp;&middot;&nbsp; # \u5171\u540c\u7b2c\u4e00\u4f5c\u8005</span></p>' +
    nav;
})();
