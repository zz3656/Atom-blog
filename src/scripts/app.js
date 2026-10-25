/**
 * Atom Blog — 合并的客户端脚本
 *
 * 模块：
 *   1. Theme toggle       → 暗黑模式切换（同步脚本在 BaseLayout <head> 已防 FOUC）
 *   2. Mobile nav         → 汉堡菜单展开/关闭
 *   3. Search             → 客户端搜索（懒加载索引）
 *   4. Back to top        → 滚动到顶部
 *   5. Code copy          → 代码块复制按钮
 *   6. Image zoom         → 文章图片点击放大
 *   7. Reading progress   → 文章阅读进度条
 *   8. TOC scroll spy     → 文章目录高亮当前章节
 *
 * 每个模块都是独立 IIFE，DOM 探测后才运行——同一份 JS 适配所有页面，
 * 用不到的模块零开销。
 *
 * 体积：源文件 ~18.3KB → esbuild 压缩后 ~8.7KB（gzip ~3.4KB）。
 * 构建时由 scripts/minify-app-js.mjs 生成 public/js/app.js，
 * 以外部文件 <script defer> 引入，全站共用一份（不是内联）。
 */
(function () {
  'use strict';

  var body = document.body;
  var searchBase = body.getAttribute('data-search-base') || '/';

  // ============================================================
  // 0. Pure utilities (testable)
  // ============================================================
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  function highlightSafe(text, query) {
    if (!query) return escapeHTML(text);
    return escapeHTML(text).replace(
      new RegExp('(' + escapeRegex(escapeHTML(query)) + ')', 'gi'),
      '<mark>$1</mark>',
    );
  }
  function scorePost(item, query) {
    var score = 0;
    if (item.content && item.content.indexOf(query) !== -1) score += 10;
    if (item.title && item.title.toLowerCase().indexOf(query) !== -1) score += 20;
    if (item.categories && item.categories.indexOf(query) !== -1) score += 5;
    if (item.tags) {
      for (var j = 0; j < item.tags.length; j++) {
        if (item.tags[j].indexOf(query) !== -1) score += 8;
      }
    }
    return score;
  }
  // 暴露纯函数供测试访问。运行时不需清理，命名空间前缀避免与全局变量冲突。
  if (typeof globalThis !== 'undefined') {
    globalThis.__atomBlogInternals = {
      escapeHTML: escapeHTML,
      escapeRegex: escapeRegex,
      highlightSafe: highlightSafe,
      scorePost: scorePost,
    };
  }

  // ============================================================
  // 1. Theme toggle (data-theme + data-mode)
  // ============================================================
  // 默认主题从 data-theme 取（允许开发者未来扩展多个主题）。
  // 简单点击：light ↔ dark。
  // 系统主题跟随：用户未手动设置时自动跟随 prefers-color-scheme。
  var themeToggle = document.getElementById('theme-toggle');
  var root = document.documentElement;

  function currentMode() {
    return root.getAttribute('data-mode') || 'light';
  }
  // 图标高亮由 CSS 依据 html[data-mode] 决定，这里只同步无障碍标签
  function syncThemeLabel() {
    if (!themeToggle) return;
    themeToggle.setAttribute(
      'aria-label',
      currentMode() === 'dark' ? '切换到浅色模式' : '切换到深色模式'
    );
  }
  function setMode(mode) {
    root.setAttribute('data-mode', mode);
    try { localStorage.setItem('themeMode', mode); } catch (e) {}
    syncThemeLabel();
  }

  if (themeToggle) {
    syncThemeLabel();

    // 点击切换
    themeToggle.addEventListener('click', function () {
      var next = currentMode() === 'dark' ? 'light' : 'dark';
      setMode(next);
      // 记录"已手动设置"，不再跟随系统主题
      try { localStorage.setItem('themeModeAuto', '0'); } catch (e) {}
    });

    // 跟随系统主题：仅在用户从未手动设置过时生效
    // localStorage.themeModeAuto === '0' 表示用户明确选择过
    var mql = window.matchMedia('(prefers-color-scheme: dark)');
    var handleSystemThemeChange = function (e) {
      try {
        if (localStorage.getItem('themeModeAuto') === '0') return;
        setMode(e.matches ? 'dark' : 'light');
      } catch (err) { /* localStorage 不可用，静默 */ }
    };
    if (mql.addEventListener) {
      mql.addEventListener('change', handleSystemThemeChange);
    } else if (mql.addListener) {
      mql.addListener(handleSystemThemeChange);
    }
  }

  // ============================================================
  // 2. Mobile nav toggle
  // ============================================================
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================================
  // 3. Search
  // ============================================================
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');

  if (searchInput && searchResults) {
    var searchIndex = [];
    var indexLoaded = false;
    var indexLoading = false;

    function ensureIndexLoaded() {
      if (indexLoaded || indexLoading) return;
      indexLoading = true;
      fetch(searchBase + '_assets/search-index.json')
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          searchIndex = data;
          indexLoaded = true;
        })
        .catch(function (e) {
          console.warn('Search index not loaded:', e.message);
        })
        .finally(function () {
          indexLoading = false;
        });
    }
    searchInput.addEventListener('focus', ensureIndexLoaded, { once: true });
    searchInput.addEventListener('input', ensureIndexLoaded, { once: true });

    function renderResults(results, query) {
      while (searchResults.firstChild) searchResults.removeChild(searchResults.firstChild);
      if (results.length === 0) {
        var empty = document.createElement('div');
        empty.className = 'search-no-result';
        empty.textContent = '没有找到相关结果';
        searchResults.appendChild(empty);
        return;
      }
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < results.length; i++) {
        var r = results[i];
        var link = document.createElement('a');
        link.href = searchBase.replace(/\/+$/, '') + '/blog/' + r.item.slug + '/';
        link.className = 'search-result-item';
        // 路径行 —— grep 输出的 "文件:行" 前缀
        var pathEl = document.createElement('div');
        pathEl.className = 'search-result-path';
        pathEl.textContent = '~/posts/' + r.item.slug + '.md';
        var titleEl = document.createElement('div');
        titleEl.className = 'search-result-title';
        titleEl.innerHTML = highlightSafe(r.item.title, query);
        var descEl = document.createElement('div');
        descEl.className = 'search-result-desc';
        descEl.innerHTML = highlightSafe(r.item.description || '', query);
        link.appendChild(pathEl);
        link.appendChild(titleEl);
        link.appendChild(descEl);
        fragment.appendChild(link);
      }
      searchResults.appendChild(fragment);
    }

    function doSearch(query) {
      var results = [];
      for (var i = 0; i < searchIndex.length; i++) {
        var s = scorePost(searchIndex[i], query);
        if (s > 0) results.push({ item: searchIndex[i], score: s });
      }
      results.sort(function (a, b) {
        return b.score - a.score;
      });
      renderResults(results.slice(0, 10), query);
      searchResults.classList.add('active');
    }

    function search(query) {
      query = query.trim().toLowerCase();
      if (!query) {
        searchResults.classList.remove('active');
        return;
      }
      if (!indexLoaded) {
        ensureIndexLoaded();
        var pollId = setInterval(function () {
          if (indexLoaded) {
            clearInterval(pollId);
            doSearch(query);
          }
        }, 50);
        setTimeout(function () {
          clearInterval(pollId);
        }, 3000);
        return;
      }
      doSearch(query);
    }

    var debounceTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        search(searchInput.value);
      }, 200);
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-wrapper')) searchResults.classList.remove('active');
    });

    // 键盘监听挂在 .search-wrapper 上，而不是 searchInput 上。
    // 原因：↓ 会把焦点从输入框移到结果项（<a>），焦点一旦离开 input，
    // 挂在 input 上的 keydown 就再也收不到按键 —— ↑ / Enter / Esc 会全部失灵，
    // 页脚那行快捷键提示就成了空话。wrapper 同时包住输入框与结果面板。
    var searchWrapper = searchInput.closest('.search-wrapper') || searchInput;
    searchWrapper.addEventListener('keydown', function (e) {
      var panelOpen = searchResults.classList.contains('active');
      var inInput = document.activeElement === searchInput;

      if (e.key === 'Escape') {
        if (!panelOpen && !inInput) return;
        searchResults.classList.remove('active');
        if (inInput) searchInput.blur();
        else searchInput.focus(); // 焦点回到输入框，便于继续编辑
        return;
      }
      if (!panelOpen) return;
      var items = searchResults.querySelectorAll('.search-result-item');
      if (items.length === 0) return;
      var idx = Array.prototype.indexOf.call(items, document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[idx < items.length - 1 ? idx + 1 : 0].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[idx > 0 ? idx - 1 : items.length - 1].focus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        // 没选中任何一条时，打开第一条（页脚提示的 [Enter] 打开）
        items[idx >= 0 ? idx : 0].click();
      }
    });
  }

  // ============================================================
  // 4. Back to top
  // ============================================================
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    var threshold = 600;
    var visible = false;
    function updateBackToTop() {
      var shouldShow = window.scrollY > threshold;
      if (shouldShow !== visible) {
        visible = shouldShow;
        backToTop.classList.toggle('visible', visible);
      }
    }
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    backToTop.addEventListener('click', function () {
      var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  // ============================================================
  // 5. Code copy buttons
  // ============================================================
  var postContent = document.querySelector('.post-content');
  if (postContent) {
    var COPY_ICON =
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
    var CHECK_ICON =
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    var pres = postContent.querySelectorAll('pre');

    // 代码块标题栏的文件名：文章 slug + 块序号 + 语言扩展名。
    // 三个来源都是真实数据 —— slug 来自文章、序号是块在正文里的次序、
    // 扩展名来自 Shiki 输出的 data-language。
    var postEl = document.querySelector('.post');
    var fileBase = (postEl && postEl.getAttribute('data-post-slug')) || 'snippet';
    var LANG_EXT = {
      bash: 'sh',
      sh: 'sh',
      shell: 'sh',
      zsh: 'sh',
      console: 'sh',
      js: 'js',
      javascript: 'js',
      ts: 'ts',
      typescript: 'ts',
      json: 'json',
      yaml: 'yml',
      yml: 'yml',
      toml: 'toml',
      html: 'html',
      css: 'css',
      scss: 'scss',
      md: 'md',
      markdown: 'md',
      py: 'py',
      python: 'py',
      rb: 'rb',
      go: 'go',
      rs: 'rs',
      rust: 'rs',
      sql: 'sql',
      dockerfile: 'dockerfile',
      nginx: 'conf',
      conf: 'conf',
      ini: 'ini',
      diff: 'diff',
      text: 'txt',
      txt: 'txt',
      plaintext: 'txt',
    };

    var codeIndex = 0;
    for (var pi = 0; pi < pres.length; pi++) {
      var pre = pres[pi];
      if (pre.parentElement && pre.parentElement.classList.contains('code-wrapper')) continue;
      codeIndex++;
      var lang = (pre.getAttribute('data-language') || '').toLowerCase();
      var ext = LANG_EXT[lang] || (lang && lang.length <= 6 ? lang : 'txt');
      var seq = codeIndex < 10 ? '0' + codeIndex : String(codeIndex);
      pre.setAttribute('data-file', fileBase + '-' + seq + '.' + ext);
      var wrapper = document.createElement('div');
      wrapper.className = 'code-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy-btn';
      btn.setAttribute('aria-label', '复制代码');
      btn.innerHTML = COPY_ICON + '<span class="code-copy-label">复制</span>';
      btn.addEventListener(
        'click',
        (function (el, button) {
          return function () {
            var code = el.querySelector('code');
            var text = code ? code.textContent : el.textContent;
            if (!text) return;
            copyToClipboard(text).then(function () {
              button.innerHTML = CHECK_ICON + '<span class="code-copy-label">已复制</span>';
              button.classList.add('copied');
              setTimeout(function () {
                button.innerHTML = COPY_ICON + '<span class="code-copy-label">复制</span>';
                button.classList.remove('copied');
              }, 2000);
            });
          };
        })(pre, btn),
      );
      wrapper.appendChild(btn);
    }

    function copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      return new Promise(function (resolve, reject) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          document.body.removeChild(textarea);
        }
      });
    }

    // ============================================================
    // 6. Image zoom
    // ============================================================
    var images = postContent.querySelectorAll('img');
    if (images.length > 0) {
      var overlay = document.createElement('div');
      overlay.className = 'image-zoom-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', '图片预览');
      overlay.style.display = 'none';
      overlay.innerHTML =
        '<button class="image-zoom-close" type="button" aria-label="关闭预览">×</button>' +
        '<img class="image-zoom-img" alt="" />';
      document.body.appendChild(overlay);

      var zoomImg = overlay.querySelector('.image-zoom-img');
      var closeBtn = overlay.querySelector('.image-zoom-close');

      function openZoom(src, alt) {
        zoomImg.src = src;
        zoomImg.alt = alt || '';
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
      }
      function closeZoom() {
        overlay.style.display = 'none';
        zoomImg.src = '';
        document.body.style.overflow = '';
      }

      for (var ii = 0; ii < images.length; ii++) {
        (function (img) {
          img.style.cursor = 'zoom-in';
          img.addEventListener('click', function () {
            openZoom(img.src, img.alt);
          });
        })(images[ii]);
      }
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target === closeBtn) closeZoom();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.style.display !== 'none') closeZoom();
      });
    }

    // ============================================================
    // 7. Reading progress bar
    // ============================================================
    var bar = document.querySelector('.reading-progress-fill');
    if (bar) {
      function updateProgress() {
        var rect = postContent.getBoundingClientRect();
        var total = postContent.scrollHeight;
        var scrolled = Math.max(
          0,
          Math.min(1, (window.innerHeight - rect.top) / (total + window.innerHeight - rect.height)),
        );
        bar.style.width = scrolled * 100 + '%';
      }
      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress, { passive: true });
      updateProgress();
    }

    // ============================================================
    // 8. TOC scroll spy
    // ============================================================
    if ('IntersectionObserver' in window) {
      var tocLinks = document.querySelectorAll('[data-toc-link]');
      if (tocLinks.length > 0) {
        var observer = new IntersectionObserver(
          function (entries) {
            for (var ei = 0; ei < entries.length; ei++) {
              var entry = entries[ei];
              if (!entry.isIntersecting) continue;
              var id = entry.target.id;
              for (var li = 0; li < tocLinks.length; li++) {
                var isActive = tocLinks[li].getAttribute('data-toc-link') === id;
                tocLinks[li].classList.toggle('active', isActive);
              }
            }
          },
          { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
        );
        for (var ti = 0; ti < tocLinks.length; ti++) {
          var id = tocLinks[ti].getAttribute('data-toc-link');
          if (!id) continue;
          var heading = document.getElementById(id);
          if (heading) observer.observe(heading);
        }
      }
    }

    // TOC 点击平滑滚动
    document.addEventListener('click', function (e) {
      var link = e.target && e.target.closest ? e.target.closest('[data-toc-link]') : null;
      if (!link) return;
      e.preventDefault();
      var targetId = link.getAttribute('data-toc-link');
      if (!targetId) return;
      var heading = document.getElementById(targetId);
      if (!heading) return;
      var top = heading.getBoundingClientRect().top + window.scrollY - 80;
      var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', '#' + targetId);
    });

    // ============================================================
    // 9. TOC 展开状态跟随视口
    // ============================================================
    // 目录默认收起（窄屏时是正文上方的折叠条，展开会吃掉一大块版面）。
    // 宽屏（>=1280px）目录变成左侧刻度栏，此时自动展开；
    // 视口跨过断点时同步切换，用户在同一档位内手动折叠不会被覆盖。
    var tocDetails = document.querySelector('[data-toc-details]');
    if (tocDetails && window.matchMedia) {
      var wideToc = window.matchMedia('(min-width: 1280px)');
      var syncToc = function (e) {
        tocDetails.open = e.matches;
      };
      syncToc(wideToc);
      if (wideToc.addEventListener) {
        wideToc.addEventListener('change', syncToc);
      } else if (wideToc.addListener) {
        wideToc.addListener(syncToc);
      }
    }
  }

  // ============================================================
  // 9. 404 真实路径回填
  // ============================================================
  // 静态 404.html 在构建期拿不到访客请求的真实路径，
  // 这里用 location.pathname 回填 [data-404-path] 占位符。
  var notFoundPaths = document.querySelectorAll('[data-404-path]');
  if (notFoundPaths.length > 0) {
    var requestedPath = window.location.pathname;
    for (var nfp = 0; nfp < notFoundPaths.length; nfp++) {
      notFoundPaths[nfp].textContent = requestedPath;
    }
  }
})();
