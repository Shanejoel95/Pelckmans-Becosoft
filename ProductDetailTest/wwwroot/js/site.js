// ===== cart helpers =====
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

// ===== toast helper (safe call) =====
function showToast(type, msg, opts) {
    var api = (window.$ && $.toastMessage) || (window.jQuery && jQuery.toastMessage);
    if (typeof api === 'function') api(type, msg, opts);
    else console.warn('[toast] plugin not found');
}

// ===== Gallery (unified: thumbs + dots + arrows) =====
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

        // keep active thumb in view (vertical list)
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

    // Init
    show(0);
}

// ===== dom ready =====
$(function () {
    // Reset cart each refresh (your original behavior)
    localStorage.removeItem('cart');
    renderCart({ count: 0, total: 0 });

    initGallery();

    // Add to cart
    $(document).off('click', '#btnAddToCart').on('click', '#btnAddToCart', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const raw = $(this).attr('data-price');
        const price = parseFloat(String(raw).replace(',', '.')) || 0;

        let cart = getCart();
        cart.count += 1;
        cart.total = Math.round((cart.total + price) * 100) / 100;

        saveCart(cart);
        showToast('success', 'Item added to cart!');
    });
});
