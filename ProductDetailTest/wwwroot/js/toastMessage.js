(function ($) {
    /**
     * $.toastMessage(type, message, options)
     * 
     * type: 'success' | 'error'
     * message: string | HTML
     * options:
     *   - duration: number (ms) default 3500 (auto-close delay)
     *   - sticky: boolean default false (if true, requires manual close)
     *   - title: string optional
     *   - onShown: function($el) optional
     *   - onClosed: function($el) optional
     * 
     * Emits events:
     *   - 'toastShown' on document and toast element
     *   - 'toastClosed' on document and toast element
     */
    $.toastMessage = function (type, message, options) {
        var opts = $.extend({
            duration: 3500,
            sticky: false,
            title: null,
            onShown: null,
            onClosed: null
        }, options);

        // Ensure container exists
        var $container = $('#toast-container');
        if ($container.length === 0) {
            $container = $('<div id="toast-container" aria-live="polite" aria-atomic="true"></div>');
            $('body').append($container);
        }

        // Create toast
        var $toast = $('<div class="toast-item" role="status" aria-live="polite" aria-atomic="true"></div>')
            .addClass(type === 'error' ? 'error' : 'success');

        var $close = $('<button type="button" class="toast-close" aria-label="Close">&times;</button>');
        $toast.append($close);

        if (opts.title) {
            $toast.append($('<div class="toast-title"></div>').text(opts.title));
        }
        $toast.append($('<div class="toast-message"></div>').html(message));

        // Add to container (stacks)
        $container.append($toast);

        // Animate in
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

        // Auto close if not sticky
        if (!opts.sticky) {
            var time = Math.max(3000, Math.min(5000, opts.duration | 0));
            setTimeout(closeToast, time);
        }

        return $toast;
    };
}(jQuery));
