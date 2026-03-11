/**
 * QuickSearch Products v2.0.0
 * Vanilla JS autocomplete widget for e-commerce product search
 * https://github.com/isetbr/quicksearch-products
 */
(function () {
  'use strict';

  const DEFAULTS = {
    minChars: 3,
    delay: 300,
    cache: true,
    maxCacheSize: 50,
    limit: 10,
    buttons: false,
    menuClass: '',
    fixedPosition: false,
    footerText: 'Ver mais resultados',
    noResultsText: 'Nenhum produto encontrado para',
    loadingText: 'Buscando...',
    apiUrl: '/ws/v1/product/search',
    fallbackImage:
      'data:image/png;base64,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',
    onSelect: (product) => {
      window.location.href = product.url;
    },
    onBuy: (productId) => {
      if (typeof window.buyNow === 'function') window.buyNow(productId);
    },
    renderItem: null,
  };

  let instanceCount = 0;

  class QuickSearch {
    constructor(selector, options = {}) {
      this.input =
        typeof selector === 'string'
          ? document.querySelector(selector)
          : selector;

      if (!this.input) {
        throw new Error(`QuickSearch: element "${selector}" not found`);
      }

      this.options = Object.assign({}, DEFAULTS, options);
      this.id = `qs-${++instanceCount}`;
      this.cache = new Map();
      this.selectedIndex = -1;
      this.lastValue = '';
      this.debounceTimer = null;
      this.abortController = null;
      this.isOpen = false;
      this.items = [];

      this._buildDropdown();
      this._setupAria();
      this._bindEvents();
    }

    // ── DOM Construction ─────────────────────────────────────

    _buildDropdown() {
      const o = this.options;

      this.dropdown = document.createElement('div');
      this.dropdown.className = `qs-dropdown${o.menuClass ? ' ' + o.menuClass : ''}`;
      this.dropdown.id = this.id;
      this.dropdown.setAttribute('role', 'listbox');
      this.dropdown.style.display = 'none';

      // Loading
      this.loadingEl = document.createElement('div');
      this.loadingEl.className = 'qs-loading';
      this.loadingEl.setAttribute('role', 'status');
      this.loadingEl.setAttribute('aria-live', 'polite');
      this.loadingEl.innerHTML = `<span class="qs-spinner"></span> ${o.loadingText}`;
      this.loadingEl.style.display = 'none';

      // Results
      this.resultsEl = document.createElement('div');
      this.resultsEl.className = 'qs-results';

      // Empty state
      this.emptyEl = document.createElement('div');
      this.emptyEl.className = 'qs-empty';
      this.emptyEl.setAttribute('role', 'status');
      this.emptyEl.setAttribute('aria-live', 'polite');
      this.emptyEl.style.display = 'none';

      // Footer
      this.footerEl = document.createElement('div');
      this.footerEl.className = 'qs-footer';
      this.footerEl.innerHTML = `<a href="#">${o.footerText}</a>`;
      this.footerEl.style.display = 'none';

      this.dropdown.appendChild(this.loadingEl);
      this.dropdown.appendChild(this.resultsEl);
      this.dropdown.appendChild(this.emptyEl);
      this.dropdown.appendChild(this.footerEl);

      if (o.fixedPosition) {
        this.dropdown.classList.add('qs-fixed');
      }

      document.body.appendChild(this.dropdown);
    }

    _setupAria() {
      this.input.setAttribute('role', 'combobox');
      this.input.setAttribute('aria-autocomplete', 'list');
      this.input.setAttribute('aria-expanded', 'false');
      this.input.setAttribute('aria-controls', this.id);
      this.input.setAttribute('aria-activedescendant', '');
      this.originalAutocomplete = this.input.getAttribute('autocomplete');
      this.input.setAttribute('autocomplete', 'off');
    }

    // ── Events ───────────────────────────────────────────────

    _bindEvents() {
      this._onInput = this._handleInput.bind(this);
      this._onKeydown = this._handleKeydown.bind(this);
      this._onBlur = this._handleBlur.bind(this);
      this._onFocus = this._handleFocus.bind(this);
      this._onResize = this._positionDropdown.bind(this);

      this.input.addEventListener('input', this._onInput);
      this.input.addEventListener('keydown', this._onKeydown);
      this.input.addEventListener('blur', this._onBlur);
      this.input.addEventListener('focus', this._onFocus);
      window.addEventListener('resize', this._onResize);

      // Delegate click on results
      this._onDropdownClick = this._handleDropdownClick.bind(this);
      this._onDropdownMouseover = this._handleDropdownMouseover.bind(this);
      this._onDropdownMouseleave = this._handleDropdownMouseleave.bind(this);
      this._onDropdownMousedown = (e) => e.preventDefault(); // prevent blur

      this.dropdown.addEventListener('click', this._onDropdownClick);
      this.dropdown.addEventListener('mouseover', this._onDropdownMouseover);
      this.dropdown.addEventListener('mouseleave', this._onDropdownMouseleave);
      this.dropdown.addEventListener('mousedown', this._onDropdownMousedown);
    }

    _handleInput() {
      const val = this.input.value;

      if (val.length < this.options.minChars) {
        this.lastValue = val;
        this._close();
        return;
      }

      if (val === this.lastValue) return;
      this.lastValue = val;

      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this._search(val), this.options.delay);
    }

    _handleFocus() {
      const val = this.input.value;
      if (val.length >= this.options.minChars && this.items.length > 0) {
        this._open();
      }
    }

    _handleBlur() {
      // Small delay to allow click events on dropdown items
      setTimeout(() => {
        if (!this.dropdown.matches(':hover')) {
          this._close();
        }
      }, 150);
    }

    _handleKeydown(e) {
      if (!this.isOpen) return;

      const itemEls = this.resultsEl.querySelectorAll('.qs-item');
      const count = itemEls.length;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.selectedIndex = this.selectedIndex < count - 1 ? this.selectedIndex + 1 : 0;
          this._updateSelection(itemEls);
          break;

        case 'ArrowUp':
          e.preventDefault();
          this.selectedIndex = this.selectedIndex > 0 ? this.selectedIndex - 1 : count - 1;
          this._updateSelection(itemEls);
          break;

        case 'Enter':
          e.preventDefault();
          if (this.selectedIndex >= 0 && itemEls[this.selectedIndex]) {
            this._selectItem(itemEls[this.selectedIndex]);
          }
          break;

        case 'Escape':
          this._close();
          break;

        case 'Tab':
          this._close();
          break;
      }
    }

    _handleDropdownClick(e) {
      const buyBtn = e.target.closest('.qs-buy-btn');
      if (buyBtn) {
        e.preventDefault();
        e.stopPropagation();
        const item = buyBtn.closest('.qs-item');
        if (item) {
          this.options.onBuy(item.dataset.id);
        }
        return;
      }

      const footerLink = e.target.closest('.qs-footer a');
      if (footerLink) {
        // Let default link behavior happen
        return;
      }

      const item = e.target.closest('.qs-item');
      if (item) {
        this._selectItem(item);
      }
    }

    _handleDropdownMouseover(e) {
      const item = e.target.closest('.qs-item');
      if (!item) return;

      const itemEls = this.resultsEl.querySelectorAll('.qs-item');
      itemEls.forEach((el, i) => {
        if (el === item) {
          this.selectedIndex = i;
          el.classList.add('qs-item--selected');
          el.setAttribute('aria-selected', 'true');
        } else {
          el.classList.remove('qs-item--selected');
          el.setAttribute('aria-selected', 'false');
        }
      });
      this.input.setAttribute('aria-activedescendant', item.id);
    }

    _handleDropdownMouseleave() {
      this._clearSelection();
    }

    // ── Search ───────────────────────────────────────────────

    _search(query) {
      const o = this.options;

      // Check cache
      if (o.cache && this.cache.has(query)) {
        this._render(query, this.cache.get(query));
        return;
      }

      // Sub-query empty optimization: if "cam" returned 0, skip "came"
      if (o.cache) {
        for (let i = query.length - 1; i >= o.minChars; i--) {
          const sub = query.slice(0, i);
          if (this.cache.has(sub) && this.cache.get(sub).length === 0) {
            this._render(query, []);
            return;
          }
        }
      }

      // Abort previous request
      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();

      this._showLoading();

      const body = new URLSearchParams();
      body.append('query', slugify(query));
      body.append('limit', o.limit);

      fetch(o.apiUrl, {
        method: 'POST',
        body: body,
        signal: this.abortController.signal,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const products = data.products || [];
          this._cacheSet(query, products);
          this._render(query, products);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('QuickSearch:', err);
            this._close();
          }
        });
    }

    _cacheSet(key, value) {
      if (!this.options.cache) return;
      if (this.cache.size >= this.options.maxCacheSize) {
        // FIFO eviction
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(key, value);
    }

    // ── Rendering ────────────────────────────────────────────

    _render(query, products) {
      this.items = products;
      this.selectedIndex = -1;
      this._hideLoading();

      if (products.length === 0) {
        this._showEmpty(query);
        return;
      }

      this.resultsEl.innerHTML = '';
      this.emptyEl.style.display = 'none';

      products.forEach((product, index) => {
        const el = this.options.renderItem
          ? this._customRender(product, query, index)
          : this._defaultRender(product, query, index);
        this.resultsEl.appendChild(el);
      });

      // Update footer link
      this.footerEl.querySelector('a').href =
        window.location.origin + '/q/' + encodeURIComponent(slugify(query.toLowerCase())).replace(/%20/g, '+');
      this.footerEl.style.display = '';

      this._open();
    }

    _defaultRender(product, query, index) {
      const o = this.options;
      const itemId = `${this.id}-item-${index}`;
      const url = '/' + slugify(product.name) + '-p' + product.id;

      const item = document.createElement('div');
      item.className = 'qs-item';
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', 'false');
      item.id = itemId;
      item.dataset.url = url;
      item.dataset.id = product.id;

      // Image
      const imgWrap = document.createElement('div');
      imgWrap.className = 'qs-item-image';
      const img = document.createElement('img');
      img.src = product.image || o.fallbackImage;
      img.alt = product.name;
      img.loading = 'lazy';
      img.width = 56;
      img.height = 56;
      img.onerror = () => {
        img.src = o.fallbackImage;
        img.onerror = null;
      };
      imgWrap.appendChild(img);

      // Content
      const content = document.createElement('div');
      content.className = 'qs-item-content';

      const name = document.createElement('div');
      name.className = 'qs-item-name';
      name.innerHTML = this._highlight(product.name, query);

      const desc = document.createElement('div');
      desc.className = 'qs-item-desc';
      desc.textContent = product.desc_small || '';

      const price = document.createElement('div');
      price.className = 'qs-item-price';
      price.textContent = product.price || '';

      content.appendChild(name);
      content.appendChild(desc);
      content.appendChild(price);

      item.appendChild(imgWrap);
      item.appendChild(content);

      // Buy button
      if (o.buttons) {
        const action = document.createElement('div');
        action.className = 'qs-item-action';
        const btn = document.createElement('button');
        btn.className = 'qs-buy-btn';
        btn.type = 'button';
        btn.textContent = 'Comprar';
        action.appendChild(btn);
        item.appendChild(action);
      }

      return item;
    }

    _customRender(product, query, index) {
      const html = this.options.renderItem(product, query, this);
      const itemId = `${this.id}-item-${index}`;
      const url = '/' + slugify(product.name) + '-p' + product.id;

      if (typeof html === 'string') {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();
        const el = wrapper.firstChild;
        el.id = itemId;
        el.setAttribute('role', 'option');
        el.setAttribute('aria-selected', 'false');
        if (!el.dataset.url) el.dataset.url = url;
        if (!el.dataset.id) el.dataset.id = product.id;
        if (!el.classList.contains('qs-item')) el.classList.add('qs-item');
        return el;
      }

      // Assume it's a DOM node
      html.id = itemId;
      html.setAttribute('role', 'option');
      html.setAttribute('aria-selected', 'false');
      return html;
    }

    _highlight(text, query) {
      if (!query) return this._escapeHtml(text);
      const escaped = this._escapeHtml(text);
      const pattern = query
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .split(/\s+/)
        .filter(Boolean)
        .join('|');
      if (!pattern) return escaped;
      const regex = new RegExp(`(${pattern})`, 'gi');
      return escaped.replace(regex, '<mark>$1</mark>');
    }

    _escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // ── States ───────────────────────────────────────────────

    _showLoading() {
      this.resultsEl.innerHTML = '';
      this.emptyEl.style.display = 'none';
      this.footerEl.style.display = 'none';
      this.loadingEl.style.display = '';
      this._open();
    }

    _hideLoading() {
      this.loadingEl.style.display = 'none';
    }

    _showEmpty(query) {
      this.resultsEl.innerHTML = '';
      this.footerEl.style.display = 'none';
      this.emptyEl.textContent = `${this.options.noResultsText} "${query}"`;
      this.emptyEl.style.display = '';
      this._open();
    }

    // ── Open / Close / Position ──────────────────────────────

    _open() {
      if (this.isOpen) return;
      this.isOpen = true;
      this._positionDropdown();
      this.dropdown.style.display = '';
      this.dropdown.classList.add('qs-dropdown--open');
      this.input.setAttribute('aria-expanded', 'true');
    }

    _close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.dropdown.classList.remove('qs-dropdown--open');
      this.dropdown.style.display = 'none';
      this.input.setAttribute('aria-expanded', 'false');
      this.input.setAttribute('aria-activedescendant', '');
      this._clearSelection();
    }

    _positionDropdown() {
      const rect = this.input.parentElement
        ? this.input.parentElement.getBoundingClientRect()
        : this.input.getBoundingClientRect();

      if (this.options.fixedPosition) {
        this.dropdown.style.position = 'fixed';
        this.dropdown.style.top = rect.bottom + 'px';
        this.dropdown.style.left = rect.left + 'px';
        this.dropdown.style.width = rect.width + 'px';
      } else {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        this.dropdown.style.position = 'absolute';
        this.dropdown.style.top = rect.bottom + scrollTop + 'px';
        this.dropdown.style.left = rect.left + scrollLeft + 'px';
        this.dropdown.style.width = rect.width + 'px';
      }
    }

    // ── Selection ────────────────────────────────────────────

    _updateSelection(itemEls) {
      itemEls.forEach((el, i) => {
        if (i === this.selectedIndex) {
          el.classList.add('qs-item--selected');
          el.setAttribute('aria-selected', 'true');
          this.input.setAttribute('aria-activedescendant', el.id);
          el.scrollIntoView({ block: 'nearest' });
        } else {
          el.classList.remove('qs-item--selected');
          el.setAttribute('aria-selected', 'false');
        }
      });
    }

    _clearSelection() {
      this.selectedIndex = -1;
      this.resultsEl.querySelectorAll('.qs-item--selected').forEach((el) => {
        el.classList.remove('qs-item--selected');
        el.setAttribute('aria-selected', 'false');
      });
      this.input.setAttribute('aria-activedescendant', '');
    }

    _selectItem(el) {
      const url = el.dataset.url;
      const id = el.dataset.id;
      const product = this.items.find((p) => String(p.id) === String(id)) || { url, id };
      if (!product.url) product.url = url;
      this._close();
      this.options.onSelect(product);
    }

    // ── Cleanup ──────────────────────────────────────────────

    destroy() {
      clearTimeout(this.debounceTimer);
      if (this.abortController) this.abortController.abort();

      this.input.removeEventListener('input', this._onInput);
      this.input.removeEventListener('keydown', this._onKeydown);
      this.input.removeEventListener('blur', this._onBlur);
      this.input.removeEventListener('focus', this._onFocus);
      window.removeEventListener('resize', this._onResize);

      this.dropdown.removeEventListener('click', this._onDropdownClick);
      this.dropdown.removeEventListener('mouseover', this._onDropdownMouseover);
      this.dropdown.removeEventListener('mouseleave', this._onDropdownMouseleave);
      this.dropdown.removeEventListener('mousedown', this._onDropdownMousedown);

      this.dropdown.remove();

      // Restore original autocomplete attribute
      if (this.originalAutocomplete !== null) {
        this.input.setAttribute('autocomplete', this.originalAutocomplete);
      } else {
        this.input.removeAttribute('autocomplete');
      }

      this.input.removeAttribute('role');
      this.input.removeAttribute('aria-autocomplete');
      this.input.removeAttribute('aria-expanded');
      this.input.removeAttribute('aria-controls');
      this.input.removeAttribute('aria-activedescendant');

      this.cache.clear();
    }
  }

  // ── Utility: slugify ─────────────────────────────────────

  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[%]+/g, 'pct')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  window.QuickSearch = QuickSearch;

  // ── jQuery Compatibility Shim ────────────────────────────
  // Bridges the legacy $.fn.autoComplete API to QuickSearch
  // so existing stores continue working without code changes.

  if (typeof jQuery !== 'undefined') {
    jQuery.fn.autoComplete = function (options) {
      if (options === 'destroy') {
        return this.each(function () {
          if (this._quicksearch) {
            this._quicksearch.destroy();
            this._quicksearch = null;
          }
        });
      }

      return this.each(function () {
        const opts = options || {};
        const mapped = {};

        // Map legacy options to new API
        if (opts.menuClass === 'suggestions-fixed') {
          mapped.fixedPosition = true;
        } else if (opts.menuClass) {
          mapped.menuClass = opts.menuClass;
        }

        if (opts.minChars !== undefined) mapped.minChars = opts.minChars;
        if (opts.delay !== undefined) mapped.delay = opts.delay;
        if (opts.cache !== undefined) mapped.cache = !!opts.cache;
        if (opts.limit !== undefined) mapped.limit = opts.limit;
        if (opts.buttons !== undefined) mapped.buttons = opts.buttons;
        if (opts.footerText !== undefined) mapped.footerText = opts.footerText;

        if (this._quicksearch) {
          this._quicksearch.destroy();
        }

        this._quicksearch = new QuickSearch(this, mapped);
      });
    };
  }
})();
