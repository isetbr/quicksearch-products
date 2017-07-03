# quicksearch-products

Compativel com jQuery 1.7.0+ in Firefox, Safari, Chrome, Opera, Internet Explorer 7+. Nenhuma dependencia exceto JQuery.

### Uso

Inclua o css auto-complete.css no <head> da sua pagina - e o JavaScript auto-complete.min.js depois de carregar o jQuery. autoComplete aceita configurações de um objeto de key/value pairs, and can be assigned to any text input field.

```$('.el').autoComplete(options);```

### Settings

Property | Default | Description
------------ | ------------- | -------------
token | undefined | Ishopping API token
minChars | 3 | Quantidade de caracteres para realizar a pesquisa
delay | 150 | Valor em milisegundos correspondente a espera entre o apertar da tecla e a pesquisa na API
cache | true | Determina se as pesquisas executadas devem ser armazenadas em cache.
menuClass | '' | Classe customizada adicionada ao menu dropdown


