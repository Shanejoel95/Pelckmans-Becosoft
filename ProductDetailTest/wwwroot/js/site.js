//  cart helpers 
function getCart() {
    try { return JSON.parse(localStorage.getItem('cart')) || { count: 0, total: 0 }; }
    catch (e) { return { count: 0, total: 0 }; }
}
function renderCart(c) {
    $('#cartCount').text(c.count);
    $('#cartTotal').text(new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(c.total || 0));
}
function saveCart(c) {
    localStorage.setItem('cart', JSON.stringify(c));
    renderCart(c);
}

/* -------------------------
   jQuery Toast Plugin 
------------------------- */
(function ($) {
    if (!$) return;

    $.toastMessage = function (type, message, options) {
        var opts = $.extend({
            duration: 3500,
            sticky: false,
            title: null
        }, options);

        // Default styles
        if (!document.getElementById('toast-styles')) {
            var css = [
                '#toast-container{position:fixed;top:12px;right:12px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;height:400px;width:min(360px,92vw)}',
                '.toast-item{pointer-events:auto;background:#111827;color:#fff;border-left:4px solid transparent;border-radius:10px;padding:12px 34px 12px 12px;box-shadow:0 6px 20px rgba(0,0,0,.25);position:relative;font:19.5px/1.25 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;opacity:0;transform:translateY(-6px);transition:opacity .16s ease,transform .16s ease}',
                '.toast-item.show{opacity:1;transform:translateY(0)}',
                '.toast-item .toast-title{font-weight:600;margin-bottom:4px}',
                '.toast-item .toast-close{position:absolute;top:6px;right:8px;border:0;background:transparent;color:#fff;font-size:18px;line-height:1;cursor:pointer}'
            ].join('');
            var style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = css;
            document.head.appendChild(style);
        }

        // Ensure container
        var $container = $('#toast-container');
        if ($container.length === 0) {
            $container = $('<div id="toast-container" aria-live="polite" aria-atomic="true"></div>');
            $('body').append($container);
        }

        // Limit stack to 10 
        var $items = $container.children('.toast-item');
        while ($items.length >= 10) {
            $items.first().remove();
            $items = $container.children('.toast-item');
        }

        // Toast element
        var $toast = $('<div class="toast-item" role="status" aria-live="polite" aria-atomic="true"></div>');
        //  border colors
        if (type === 'error') $toast.css('border-left-color', '#ef4444');   
        else $toast.css('border-left-color', '#facc15');                    

        var $close = $('<button type="button" class="toast-close" aria-label="Close">&times;</button>');
        $toast.append($close);

        if (opts.title) $toast.append($('<div class="toast-title"></div>').text(opts.title));
        $toast.append($('<div class="toast-message"></div>').html(message));

        // Stack in container
        $container.append($toast);

        // Animate in + emit
        requestAnimationFrame(function () {
            $toast.addClass('show');
            $(document).trigger('toastShown', [$toast, type]);
            $toast.trigger('toastShown', [type]);
        });

        // Close behavior
        function closeToast() {
            $toast.removeClass('show');
            setTimeout(function () {
                $toast.remove();
                $(document).trigger('toastClosed', [$toast, type]);
                $toast.trigger('toastClosed', [type]);
            }, 160);
        }

        $close.on('click', function (e) { e.preventDefault(); e.stopPropagation(); closeToast(); });

        // Auto close
        if (!opts.sticky) {
            var time = Math.max(3000, Math.min(5000, (opts.duration | 0) || 3500));
            setTimeout(closeToast, time);
        }

        return $toast;
    };
})(window.jQuery);

//  toast message wrapper
function showToast(type, msg, opts) {
    var api = (window.$ && $.toastMessage) || (window.jQuery && jQuery.toastMessage);
    if (typeof api === 'function') api(type, msg, opts);
    else console.warn('[toast] plugin not found');
}

//Gallery (thumbs, dots ,arrows) 
function initGallery() {
    var $hero = $('#heroImage').length ? $('#heroImage') : $('#mainImage');
    var $thumbs = $('#thumbList .thumb');
    if ($thumbs.length === 0) $thumbs = $('.thumb');
    var $dotsWrap = $('.pager-dots');
    var current = 0;

    function ensureDots() {
        if ($dotsWrap.length === 0) return;
        if ($dotsWrap.children('.dot').length !== $thumbs.length) {
            $dotsWrap.empty();
            $thumbs.each(function (i) {
                $('<span class="dot" />').attr('data-index', i).appendTo($dotsWrap);
            });
        }
    }
    ensureDots();
    var $dots = $dotsWrap.find('.dot');

    function show(idx) {
        if ($thumbs.length === 0) return;
        if (idx < 0) idx = $thumbs.length - 1;
        if (idx >= $thumbs.length) idx = 0;
        current = idx;

        var src = $thumbs.eq(current).attr('src');
        $hero.attr('src', src);

        $thumbs.removeClass('active').eq(current).addClass('active');
        $dots.removeClass('active').eq(current).addClass('active');

        var container = document.querySelector('.thumbs');
        var active = $thumbs.get(current);
        if (container && active && active.scrollIntoView) {
            active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    }

    // Events
    $thumbs.off('click.gallery').on('click.gallery', function () {
        var idx = $(this).is('[data-index]') ? parseInt($(this).attr('data-index'), 10) : $thumbs.index(this);
        show(isNaN(idx) ? 0 : idx);
    });

    $dots.off('click.gallery').on('click.gallery', function () {
        var idx = parseInt($(this).attr('data-index'), 10) || 0;
        show(idx);
    });

    $('.nav-arrow.prev').off('click.gallery').on('click.gallery', function (e) { e.preventDefault(); show(current - 1); });
    $('.nav-arrow.next').off('click.gallery').on('click.gallery', function (e) { e.preventDefault(); show(current + 1); });

    show(0);
}

/* -------------------------
   Tabs (minimal)
------------------------- */
function initTabs() {
    var $tabs = $('[data-tab]');
    var $panels = $('[data-tab-panel]');
    if ($tabs.length === 0 || $panels.length === 0) return;

    function activate(key) {
        $tabs.removeClass('active').filter('[data-tab="' + key + '"]').addClass('active');
        $panels.attr('hidden', true).removeClass('active')
            .filter('[data-tab-panel="' + key + '"]').removeAttr('hidden').addClass('active');
    }

    $tabs.off('click.tabs').on('click.tabs', function (e) {
        e.preventDefault();
        activate($(this).attr('data-tab'));
    });

    var initial = $tabs.filter('.active').attr('data-tab') || $tabs.first().attr('data-tab');
    activate(initial);
}

//  dom ready 
$(function () {
    localStorage.removeItem('cart');
    renderCart({ count: 0, total: 0 });

    initGallery();
    initTabs();

    $(document).off('click', '#btnAddToCart').on('click', '#btnAddToCart', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const raw = $(this).attr('data-price');
        const price = parseFloat(String(raw).replace(',', '.')) || 0;

        let cart = getCart();
        cart.count += 1;
        cart.total = Math.round((cart.total + price) * 100) / 100;

        saveCart(cart);
        showToast('success', 'Item added to cart!', { duration: 3500 });
    });
});
