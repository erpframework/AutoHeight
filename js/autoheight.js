/* ==========================================================================
 * jQuery autoheight plugin - autoheight.js
 ========================================================================== */

; (function ($, window, document, undefined) {

    // 'undefined' é usado aqui como a variável global 'undefined', no ECMAScript 3 é
    // mutável (ou seja, pode ser alterada por alguém). 'undefined' não está sendo
    // passado na verdade, assim podemos assegurar que o valor é realmente indefinido.
    // No ES5, 'undefined' não pode mais ser modificado.

    // 'window' e 'document' são passados como variáveis locais ao invés de globais,
    // assim aceleramos (ligeiramente) o processo de resolução e pode ser mais eficiente
    // quando minificado (especialmente quando ambos estão referenciados corretamente).

    // Cria as propriedades padrão
    var pluginName = "autoheight",
        defaults = {
            container: window,
            animate: false,
            offset: 0,
            minHeight: 0,
            withClass: ""
        };

    // O verdadeiro construtor do plugin
    function Plugin(element, options) {

        this.$element = $(element);

        // jQuery tem um método 'extend' que mescla o conteúdo de dois ou
        // mais objetos, armazenando o resultado no primeiro objeto. O primeiro
        // objeto geralmente é vazio já que não queremos alterar os valores
        // padrão para futuras instâncias do plugin
        this.options = $.extend({}, defaults, this.$element.data(), options);

        this._defaults = defaults;
        this._name = pluginName;
        this._event = $.noop;

        this.init();
    }

    /* MÉTODOS PÚBLICOS
     * ====================== */
    Plugin.prototype = {

        init: function () {

            // Armazena as opções
            var options = this.options,
                $element = this.$element,
                $container = options.container;

            // 1 - Trata o container
            if (!$.isWindow($container)) {
                // Transforma em seletor, caso necessário
                if (!($container instanceof $)) {
                    $container = $($container);
                }
            }
            else {
                $container = $(window);
            }

            // 2 - Seta o tamanho
            this._event = function () {

                if (options.withClass && $element.hasClass(options.withClass))
                    return;

                var height = $container.height() - options.offset;

                if (options.minHeight > 0 && height < options.minHeight && $element.height() !== options.minHeight) {
                    $element.height(options.minHeight);
                }

                if (options.minHeight > 0 && height > options.minHeight) {
                    $element.height(height);
                }

                else if (!options.minHeight) {
                    $element.height(height);
                }
            };

            // 3 - Habilita o trigger
            this.enable();

            // 4 - Adiciona a classe de animação
            // setTimeout(function () { 
            //    $element.css(prefixCss("transition", "height .5s cubic-bezier(1.000, -0.500, 0.400, 1.400)"));
            // });
        },

        enable: function () {
            $(window).on('resize', this._event).trigger('resize');
        },

        disable: function (el, options) {
            $(window).off('resize', this._event);
        }
    };

    /* MÉTODOS PRIVADOS
     * ====================== */
    function prefixCss(property, value) {

        var prefixes = $.map(['-webkit-', '-moz-', '-o-', '-ms-', ''], function (prefix) {
            return prefix + (property || "");
        });

        var css = {};
        prefixes.forEach(function (prefix) {
            css[prefix] = value;
        });

        return css;
    }

    // Um invólucro realmente leve em torno do construtor,
    // prevenindo contra criação de múltiplas instâncias
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);