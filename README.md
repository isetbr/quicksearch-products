# quicksearch-products

Compativel com jQuery 1.7.0+ in Firefox, Safari, Chrome, Opera, Internet Explorer 7+. Nenhuma dependência exceto JQuery.

### Uso

Inclua o css auto-complete.css no `<head>` da sua pagina - e o JavaScript auto-complete.min.js depois de carregar o jQuery. autoComplete aceita configurações de um objeto de key/value, e pode ser aplicado em qualquer text input

```$(selector).autoComplete(options);```

### Settings

Propriedade | Padrão | Descrição
------------ | ------------- | -------------
token | undefined | Ishopping API token
minChars | 3 | Quantidade de caracteres para realizar a pesquisa
delay | 150 | Valor em milisegundos correspondente a espera entre o apertar da tecla e a pesquisa na API
cache | true | Determina se as pesquisas executadas devem ser armazenadas em cache.
menuClass | '' | Classe customizada adicionada ao menu dropdown
buttons | false | Ativa/Desativa botão comprar da listagem de produtos
template | `html` | html da estrutura de exibição dos itens dropdown
buttonTpl | `html` | html da estrutura do botão comprar a propriedade `buttons` deve estar setada como true para exibição do botão

template padrão:

```
<div class="autocomplete-suggestion" data-val="{name}" data-slug="{url}">' +
    <div class="autocomplete-suggestion-img">
        <img src="{image}">
    </div>
    <div class="autocomplete-suggestion-body">
        <div class="autocomplete-col-{col}">
            <div class="autocomplete-title">{name}</div>
            <div class="autocomplete-price">{price}</div>
        </div>
        {buttons}
    </div>
</div>
```

Tags de substituição do template:

- `{name}` Nome do produto.
- `{url}` Url do produto.
- `{image}` Imagem do produto.
- `{price}` Preço do produto.
- `{col}` Colunas do template, se a opção `buttons` estiver ativa o template é dividido em duas colunas, uma para o conteúdo do produto e outra para o template do botão.
- `{buttons}` Esta tag é substituida pelo template do botão comprar.

Template do botão padrão:

```
<div class="autocomplete-col-s6">
	<div class="autocomplete-buttons">
		<a id="bt_comprar" style="display:block;" href="javascript:void(0);" rel="{id}" onclick="buyNow(this.rel);" title="Comprar">Comprar</a>
	</div>
</div>
```

Tags de substituição do botão:

- `{id}` ID do produto.


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