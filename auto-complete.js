(function($){
    $.fn.autoComplete = function(options) {
        var o = $.extend({}, $.fn.autoComplete.defaults, options);

        // public methods
        if (typeof options == 'string') {
            this.each(function() {
                var that = $(this);
                if (options == 'destroy') {
                    $(window).off('resize.autocomplete', that.updateSC);
                    that.off('blur.autocomplete focus.autocomplete keydown.autocomplete keyup.autocomplete');
                    if (that.data('autocomplete'))
                        that.attr('autocomplete', that.data('autocomplete'));
                    else
                        that.removeAttr('autocomplete');
                    $(that.data('sc')).remove();
                    that.removeData('sc').removeData('autocomplete');
                }
            });
            return this;
        }

        return this.each(function() {
            var that = $(this);
            // sc = 'suggestions container'
            that.sc = $('<div class="autocomplete-suggestions '+o.menuClass+'"></div>');
            that.data('sc', that.sc).data('autocomplete', that.attr('autocomplete'));
            that.attr('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = function(resize, next) { 
                that.sc.css({
                    top: that.parent().offset().top + that.parent().outerHeight(),
                    left: that.parent().offset().left,
                    width: that.parent().outerWidth()
                });
                if (!resize) {
                    that.sc.show();
                    if (!that.sc.maxHeight) that.sc.maxHeight = parseInt(that.sc.css('max-height'));
                    if (!that.sc.suggestionHeight) that.sc.suggestionHeight = $('.autocomplete-suggestion', that.sc).first().outerHeight();
                    if (that.sc.suggestionHeight)
                        if (!next) that.sc.scrollTop(0);
                        else {
                            var scrTop = that.sc.scrollTop(), selTop = next.offset().top - that.sc.offset().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0)
                                that.sc.scrollTop(selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight);
                            else if (selTop < 0)
                                that.sc.scrollTop(selTop + scrTop);
                        }
                }
            }
            $(window).on('resize.autocomplete', that.updateSC);

            that.sc.appendTo('body');

            that.sc.on('mouseleave', '.autocomplete-suggestion', function () {
                $('.autocomplete-suggestion.selected').removeClass('selected');
            });

            that.sc.on('mouseenter', '.autocomplete-suggestion', function () {
                $('.autocomplete-suggestion.selected').removeClass('selected');
                $(this).addClass('selected');
            });

            that.sc.on('click', '.autocomplete-suggestion', function (e) {
                var item = $(this), v = item.data('val');
                if (v || item.hasClass('autocomplete-suggestion')) { // else outside click
                    that.val(v);
                    o.onSelect(e, v, item);
                    //that.sc.hide();
                }
                return false;
            });

            that.on('blur.autocomplete', function() {
                try { over_sb = $('.autocomplete-suggestions:hover').length; } catch(e){ over_sb = 0; } // IE7 fix :hover
                if (!over_sb) {
                    that.last_val = that.val();
                    that.sc.hide();
                    setTimeout(function(){ that.sc.hide(); }, 350); // hide suggestions on fast input
                } else if (!that.is(':focus')) setTimeout(function(){ that.focus(); }, 20);
            });

            if (!o.minChars) that.on('focus.autocomplete', function(){ that.last_val = '\n'; that.trigger('keyup.autocomplete'); });

            function suggest(data) {
                var val = that.val();
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    var s = '';
                    for (var i=0;i<data.length;i++) s += o.renderItem(data[i], {template: o.template, buttons: o.buttons, buttonTpl: o.buttonTpl});
                    that.sc.html(s);
                    that.updateSC(0);
                }
                else
                    that.sc.hide();
            }

            that.on('keydown.autocomplete', function(e) {
                // down (40), up (38)
                if ((e.which == 40 || e.which == 38) && that.sc.html()) {
                    var next, sel = $('.autocomplete-suggestion.selected', that.sc);
                    if (!sel.length) {
                        next = (e.which == 40) ? $('.autocomplete-suggestion', that.sc).first() : $('.autocomplete-suggestion', that.sc).last();
                        that.val(next.addClass('selected').data('val'));
                    } else {
                        next = (e.which == 40) ? sel.next('.autocomplete-suggestion') : sel.prev('.autocomplete-suggestion');
                        if (next.length) { sel.removeClass('selected'); that.val(next.addClass('selected').data('val')); }
                        else { sel.removeClass('selected'); that.val(that.last_val); next = 0; }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                else if (e.which == 27) that.val(that.last_val).sc.hide();
                // enter or tab
                else if (e.which == 13 || e.which == 9) {
                    var sel = $('.autocomplete-suggestion.selected', that.sc);
                    if (sel.length && that.sc.is(':visible')) { o.onSelect(e, sel.data('val'), sel); setTimeout(function(){ that.sc.hide(); }, 20); }
                }
            });

            that.on('keyup.autocomplete', function(e) {
                if (!~$.inArray(e.which, [13, 27, 35, 36, 37, 38, 39, 40])) {
                    var val = that.val();
                    if (val.length >= o.minChars) {
                        if (val != that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (var i=1; i<val.length-o.minChars; i++) {
                                    var part = val.slice(0, val.length-i);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
                            that.timer = setTimeout(function(){ o.source(val, suggest, o.token) }, o.delay);
                        }
                    } else {
                        that.last_val = val;
                        that.sc.hide();
                    }
                }
            });
        });

    }

    $.fn.autoComplete.defaults = {
        token: undefined,
        minChars: 3,
        delay: 150,
        cache: 1,
        buttons: true,
        menuClass: '',
        template: '<div class="autocomplete-suggestion" data-val="{name}" data-slug="{url}">' +
            '<div class="autocomplete-suggestion-img">' +
                '<img src="{image}">' +
            '</div>' +
            '<div class="autocomplete-suggestion-body">' +
                '<div class="autocomplete-col-{col}">' +
                    '<div class="autocomplete-title">{name}</div>' +
                    '<div class="autocomplete-price">{price}</div>' +
                '</div>' +
                '{buttons}' +
            '</div>' +
        '</div>',
        buttonTpl: '<div class="autocomplete-col-s6"><div class="autocomplete-buttons"><div class="cart_quantity_button btn-add" id="cart_quantity_button"><button class="pull-left" disabled="true" id="cart_quantity_down" rel="{id}" title="Remover"><i class="icon-white icon-minus"></i></button><div class="input"><input autocomplete="off" class="form-control input-sm" id="qty_updown_{id}" maxlength="4" name="qty_updown_{id}" onblur="if(this.value=="") { this.value="0"; }" onfocus="if(FormataMoeda(this.value,2)==0) { this.value=""; this.focus(); this.select(); }" onkeypress="return txtFormat(this, "9999", event);" pattern="[0-9]*" rel="{id}" size="4" type="text" value="0" /><span rel="{id}">Adicionar</span></div><button class="pull-right" id="cart_quantity_up" rel="{id}" title="Adicionar"><i class="icon-white icon-plus"></i></button></div></div></div>',
        renderItem: function (item, options) {
            var template = options.template.replace(/{name}/g, item.name);
            template = template.replace(/{url}/g, slugify(item.name) +"-p"+item.id);
            template = template.replace(/{image}/g, item.image);
            template = template.replace(/{price}/g, item.price);

            if (options.buttons) {
                template = template.replace(/{col}/g, 's6');
                template = template.replace(/{buttons}/g, options.buttonTpl);
            } else {
                template = template.replace(/{col}/g, 's12');
                template = template.replace(/{buttons}/g, '');
            }

            return template;
        },
        onSelect: function(e, term, item) {
            window.location.href = item.attr('data-slug');
            return false;
        },
        source: function(term, response, token) {
            $.ajax({
                type: "POST",
                url: window.location.origin+'/ws/v1/product/search',
                dataType: "json",
                data: {query: term, img_w: 50, img_h: 50},
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("access-token", token);
                },
                success: function(data) {
                    response(data.products);
                },
                error: function(result,status,xhr) {
                  console.log(result.responseJSON);
                }
            });
        }

    };

    function slugify(text) {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    }
}(jQuery));