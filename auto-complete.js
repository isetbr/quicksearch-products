(function($){

    jQuery.fn.highlight = function(pat) {
        var map={"‚":"a","¬":"A","‡":"a","¿":"A","·":"a","¡":"A","„":"a","√":"A","Í":"e"," ":"E","Ë":"e","»":"E","È":"e","…":"E","Ó":"i","Œ":"I","Ï":"i","Ã":"I","Ì":"i","Õ":"I","ı":"o","’":"O","Ù":"o","‘":"O","Ú":"o","“":"O","Û":"o","”":"O","¸":"u","‹":"U","˚":"u","€":"U","˙":"u","⁄":"U","˘":"u","Ÿ":"U","Á":"c","«":"C"};
        function innerHighlight(node, pat) {
            var skip = 0;
            if (node.nodeType == 3) {
                var pos = node.data.replace(/[\W\[\] ]/g,function(a){return map[a]||a}).toUpperCase().indexOf(pat);
                pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
                if (pos >= 0) {
                    var spannode = document.createElement('span');
                    spannode.className = 'highlight';
                    var middlebit = node.splitText(pos);
                    var endbit = middlebit.splitText(pat.length);
                    var middleclone = middlebit.cloneNode(true);
                    spannode.appendChild(middleclone);
                    middlebit.parentNode.replaceChild(spannode, middlebit);
                    skip = 1;
                }
            }
            else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                for (var i = 0; i < node.childNodes.length; ++i) {
                    i += innerHighlight(node.childNodes[i], pat);
                }
            }
            return skip;
        }
        return this.length && pat && pat.length ? this.each(function() {
            innerHighlight(this, pat.replace(/[\W\[\] ]/g,function(a){return map[a]||a}).toUpperCase());
        }) : this;
    };

    jQuery.fn.removeHighlight = function() {
        return this.find("span.highlight").each(function() {
            this.parentNode.firstChild.nodeName;
            with (this.parentNode) {
                replaceChild(this.firstChild, this);
                normalize();
            }
        }).end();
    };
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
            that.sc = $('<div class="autocomplete-suggestions ' + o.menuClass + '" style="display: none;"><div class="suggestions-content"></div><div class="suggestions-footer"><a href="#">' + o.footerText + '</a></div></div>');
            

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

            that.c = $('.suggestions-content');
            that.sf = $('.suggestions-footer');

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
                    that.sf.find('a').attr('href', window.location.origin+'/q/'+encodeURIComponent(val).replace(/%20/g, "+"));
                    that.c.html(s);
                    that.updateSC(0);
                    $("div.autocomplete-suggestion-img img").error(function() {
                        $(this).attr("src","data:image/png;base64,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").stop(true, true).hide().fadeIn();
                    });
                    $("div.suggestions-content").highlight(val);
                } else {
                    that.sc.hide();
                }
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
                            that.timer = setTimeout(function(){ o.source(val, suggest) }, o.delay);
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
        minChars: 3,
        delay: 150,
        cache: 1,
        buttons: false,
        menuClass: '',
        template: '<div class="autocomplete-suggestion" data-val="{name}" data-slug="{url}">' +
            '<div class="autocomplete-suggestion-img">' +
                '<img src="{image}" width="50" height="50">' +
            '</div>' +
            '<div class="autocomplete-suggestion-body">' +
                '<div class="autocomplete-col-{col}">' +
                    '<div class="autocomplete-title">{name}</div>' +
                    '<div class="autocomplete-desc">{desc}</div>' +
                    '<div class="autocomplete-price">{price}</div>' +
                '</div>' +
                '{buttons}' +
            '</div>' +
        '</div>',
        buttonTpl: '<div class="autocomplete-col-s6"><div class="autocomplete-buttons"><a id="bt_comprar" style="display:block;" href="javascript:void(0);" rel="{id}" onclick="buyNow(this.rel);" title="Comprar">Comprar</a></div></div>',
        footerText: 'Ver mais resultados',
        renderItem: function (item, options) {
            var template = options.template.replace(/{name}/g, item.name);
            template = template.replace(/{url}/g, "/"+slugify(item.name) +"-p"+item.id);
            template = template.replace(/{desc}/g, item.desc_small);
            template = template.replace(/{image}/g, item.image);
            template = template.replace(/{price}/g, item.price);

            if (options.buttons) {
                template = template.replace(/{col}/g, 's6');
                var btn = options.buttonTpl.replace(/{id}/g, item.id);
                template = template.replace(/{buttons}/g, btn);
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
        source: function(term, response) {
            $.ajax({
                type: "POST",
                url: window.location.origin+'/ws/v1/product/search',
                dataType: "json",
                data: {query: term},
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
          .replace(/[‡¿·¡‚¬„‰ƒ≈Â™]+/g, 'a')      // Special Characters #1
          .replace(/[Ë»È…Í ÎÀ]+/g, 'e')       	// Special Characters #2
          .replace(/[ÏÃÌÕÓŒÔœ]+/g, 'i')       	// Special Characters #3
          .replace(/[Ú“Û”Ù‘ı’ˆ÷∫]+/g, 'o')      	// Special Characters #4
          .replace(/[˘Ÿ˙⁄˚€¸‹]+/g, 'u')       	// Special Characters #5
          .replace(/[˝›ˇ?]+/g, 'y')       		// Special Characters #6
          .replace(/[Ò—]+/g, 'n')       			// Special Characters #7
          .replace(/[Á«]+/g, 'c')       		// Special Characters #8
          .replace(/[ﬂ]+/g, 'ss')       		// Special Characters #9
          .replace(/[∆Ê]+/g, 'ae')       	    // Special Characters #10
          .replace(/[ÿ¯?]+/g, 'oe')       		// Special Characters #11
          .replace(/[%]+/g, 'pct')       		// Special Characters #12
          .replace(/\s+/g, '-')           		// Replace spaces with -
          .replace(/[^\w\-]+/g, '')       		// Remove all non-word chars
          .replace(/\-\-+/g, '-')         		// Replace multiple - with single -
          .replace(/^-+/, '')             		// Trim - from start of text
          .replace(/-+$/, '');            		// Trim - from end of text
    }
}(jQuery));