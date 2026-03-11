# QuickSearch Products v2.0.0

Widget de busca rápida (autocomplete) para e-commerce. Vanilla JS, sem dependências.

## Instalação

Inclua `quicksearch.css` no `<head>` e `quicksearch.js` (ou as versões `.min`) antes de fechar o `</body>`:

```html
<link rel="stylesheet" href="quicksearch.css">
<script src="quicksearch.js"></script>
```

## Uso

```html
<input id="keywords" type="text" name="q" placeholder="Pesquisa">
```

```js
new QuickSearch('#keywords', {
  fixedPosition: true,
  buttons: true
});
```

## Opções

| Propriedade | Padrão | Descrição |
|---|---|---|
| `minChars` | `3` | Caracteres mínimos para iniciar a busca |
| `delay` | `300` | Debounce em milissegundos |
| `cache` | `true` | Cache de resultados em memória |
| `maxCacheSize` | `50` | Máximo de queries cacheadas (FIFO) |
| `limit` | `10` | Máximo de itens retornados pela API |
| `buttons` | `false` | Exibe botão "Comprar" em cada item |
| `menuClass` | `''` | Classe CSS adicional no dropdown |
| `fixedPosition` | `false` | Usa `position: fixed` no dropdown (para barras fixas) |
| `footerText` | `'Ver mais resultados'` | Texto do link no rodapé |
| `noResultsText` | `'Nenhum produto encontrado para'` | Texto do estado vazio |
| `loadingText` | `'Buscando...'` | Texto do estado de carregamento |
| `apiUrl` | `'/ws/v1/product/search'` | URL do endpoint de busca |
| `fallbackImage` | `data:image/png;base64,...` | Imagem placeholder para erros |
| `onSelect` | `(product) => { location.href = product.url }` | Callback ao selecionar item |
| `onBuy` | `(id) => { window.buyNow(id) }` | Callback do botão comprar |
| `renderItem` | `null` | Função customizada de renderização |

## Customização CSS

Todas as cores e tamanhos são controlados via CSS custom properties:

```css
:root {
  --qs-bg: #fff;
  --qs-border: #e0e0e0;
  --qs-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  --qs-radius: 8px;
  --qs-item-hover-bg: #f5f5f5;
  --qs-item-selected-bg: #eef2ff;
  --qs-title-color: #1a1a1a;
  --qs-desc-color: #666;
  --qs-price-color: #e53935;
  --qs-price-size: 1.125rem;
  --qs-highlight-bg: #fff3cd;
  --qs-img-size: 56px;
  --qs-btn-bg: #1a73e8;
  --qs-btn-color: #fff;
}
```

## Render customizado

```js
new QuickSearch('#keywords', {
  renderItem(product, query, instance) {
    return `<div class="qs-item" data-url="${product.url}" data-id="${product.id}">
      <strong>${product.name}</strong> - ${product.price}
    </div>`;
  }
});
```

## API

```js
const qs = new QuickSearch('#keywords');

// Destruir instância (limpa eventos e DOM)
qs.destroy();
```

## Acessibilidade

O widget implementa o padrão ARIA combobox:
- `role="combobox"` no input com `aria-autocomplete`, `aria-expanded`, `aria-controls`
- `role="listbox"` no dropdown, `role="option"` nos itens
- Navegação por teclado: Arrow Up/Down, Enter, Escape, Tab
- `aria-live="polite"` nos estados de loading e vazio

## Navegação por teclado

| Tecla | Ação |
|---|---|
| Arrow Down / Up | Navegar entre itens |
| Enter | Selecionar item ativo |
| Escape | Fechar dropdown |
| Tab | Fechar dropdown e seguir fluxo |

## Build

```bash
npm install
npm run build
```

Gera `quicksearch.min.js` e `quicksearch.min.css`.

## Migração v1 (jQuery) → v2 (Vanilla)

```js
// Antes
$("#keywords").autoComplete({ menuClass: "suggestions-fixed", buttons: true });

// Depois
new QuickSearch('#keywords', { fixedPosition: true, buttons: true });
```

Principais mudanças:
- Sem dependência de jQuery
- `menuClass: "suggestions-fixed"` → `fixedPosition: true`
- Debounce padrão: 150ms → 300ms
- Fetch + AbortController (cancela requests pendentes)
- Cache com limite e evição FIFO
- Acessibilidade ARIA completa
- CSS moderno com variáveis e flexbox
- Responsivo com touch targets adequados

Os arquivos antigos (`auto-complete.*`) permanecem no repositório para referência.
