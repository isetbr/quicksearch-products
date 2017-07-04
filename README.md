# quicksearch-products

Compativel com jQuery 1.7.0+ in Firefox, Safari, Chrome, Opera, Internet Explorer 7+. Nenhuma dependência exceto JQuery.

### Uso

Inclua o css auto-complete.css no `<head>` da sua pagina - e o JavaScript auto-complete.min.js depois de carregar o jQuery. autoComplete aceita configurações de um objeto de key/value, e pode ser aplicado em qualquer text input

```$(selector).autoComplete(options);```

### Settings

Property | Default | Description
------------ | ------------- | -------------
token | undefined | Ishopping API token
minChars | 3 | Quantidade de caracteres para realizar a pesquisa
delay | 150 | Valor em milisegundos correspondente a espera entre o apertar da tecla e a pesquisa na API
cache | true | Determina se as pesquisas executadas devem ser armazenadas em cache.
menuClass | '' | Classe customizada adicionada ao menu dropdown

Notas:

- O campo `token` é obrigatório
- No caso da barra de pesquisa ser fixa/flutuante na página, utilizar na opção `menuClass` o valor `suggestions-fixed`

### Exemplo

```
<input id="keywords" type="text" name="q" placeholder="Pesquisa">
```

```
$("#keywords").autoComplete({
    token: "a9d8b9ff499ded8bd9309be98eda4822e3f08f817d69ed2b36",
    menuClass: "suggestions-fixed",
});
```