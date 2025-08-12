(function ($) {
    /** 
     * Emits events:
        - 'toastShown' on document and toast element
        - 'toastClosed' on document and toast element
     */
    $.toastMessage = function (type, message, options) {
        var opts = $.extend({
            duration: 3500,
            sticky: false,
            title: null,
            onShown: null,
            onClosed: null
        }, options);

        //  default styles 
        if (!document.getElementById('toast-styles')) {
            var css = [
                '#toast-container{position:fixed;top:12px;right:12px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;width:min(360px,92vw)}',
                '.toast-item{pointer-events:auto;background:#111827;color:#fff;border-left:6px solid transparent;border-radius:12px;padding:12px 40px 12px 14px;box-shadow:0 6px 20px rgba(0,0,0,.25);position:relative;font:14px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;opacity:0;transform:translateY(-6px);transition:opacity .18s ease, transform .18s ease}',
                '.toast-item.show{opacity:1;transform:translateY(0)}',
                '.toast-item .toast-close{position:absolute;top:6px;right:8px;border:0;background:transparent;color:#fff;font-size:18px;line-height:1;cursor:pointer}'
            ].join('');
            var style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = css;
            document.head.appendChild(style);
        }

        // Ensure container exists
        var $container = $('#toast-container');
        if ($container.length === 0) {
            $container = $('<div id="toast-container" aria-live="polite" aria-atomic="true"></div>');
            $('body').append($container);
        }

        // Create toast
        var $toast = $('<div class="toast-item" role="status" aria-live="polite" aria-atomic="true"></div>')
            .addClass(type === 'error' ? 'error' : 'success');

        //border colors
        if (type === 'error') {
            $toast.css('border-left-color', '#ef4444');
        } else {
            $toast.css('border-left-color', '#facc15');
        }

        var $close = $('<button type="button" class="toast-close" aria-label="Close">&times;</button>');
        $toast.append($close);

        if (opts.title) {
            $toast.append($('<div class="toast-title"></div>').text(opts.title));
        }
        $toast.append($('<div class="toast-message"></div>').html(message));

        // Add to container stack
        $container.append($toast);

        // Animate in + emit shown
        requestAnimationFrame(function () {
            $toast.addClass('show');
            $(document).trigger('toastShown', [$toast, type]);
            $toast.trigger('toastShown', [type]);
            if (typeof opts.onShown === 'function') opts.onShown($toast);
        });

        // Close function
        var closeToast = function () {
            $toast.removeClass('show');
            setTimeout(function () {
                $toast.remove();
                $(document).trigger('toastClosed', [$toast, type]);
                $toast.trigger('toastClosed', [type]);
                if (typeof opts.onClosed === 'function') opts.onClosed($toast);
            }, 180);
        };

        $close.on('click', closeToast);

        // Auto closein 3 second.
        if (!opts.sticky) {
            var time = Math.max(3000, Math.min(5000, opts.duration | 0));
            setTimeout(closeToast, time);
        }

        return $toast;
    };
}(jQuery));
