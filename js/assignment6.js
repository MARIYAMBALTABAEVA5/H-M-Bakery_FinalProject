// Assignment 6: jQuery, search, animations, forms and effects.

$(document).ready(function () {
    console.log('jQuery is ready!');

    // Products array
    const products = [
        { name: 'Chocolate Cake', price: 2500, image: 'images/chocolate-cake.jpg' },
        { name: 'Vanilla Cake', price: 2300, image: 'images/vanilla-cake.jpg' },
        { name: 'Cookies', price: 850, image: 'images/cookies.jpg' },
        { name: 'Croissant', price: 950, image: 'images/croissant.jpg' },
        { name: 'Latte', price: 1200, image: 'images/latte.jpg' },
        { name: 'Milkshake', price: 1500, image: 'images/milkshake.jpg' },
        { name: 'Banana Caramel Shake', price: 1600, image: 'images/banana-caramel-shake.jpg' },
        { name: 'Strawberry Milkshake', price: 1500, image: 'images/milkshake-2.jpg' },
        { name: 'Chocolate Shake', price: 1600, image: 'images/milkshake.jpg' },
        { name: 'Green Tea', price: 900, image: 'images/green-tea.jpg' }
    ];

    const $search = $('#a6-search');
    const $results = $('#a6-results');
    const $suggestions = $('#a6-suggestions');

    // Escape HTML
    function escapeHtml(value) {
        return $('<div>').text(value).html();
    }

    // Highlight search matches
    function highlight(value, query) {
        if (!query) return escapeHtml(value);

        const lower = value.toLowerCase();
        const needle = query.toLowerCase();

        if (!needle) return escapeHtml(value);

        let output = '';
        let from = 0;
        let position;

        while ((position = lower.indexOf(needle, from)) !== -1) {
            output += escapeHtml(value.slice(from, position));

            output += '<mark>' +
                escapeHtml(value.slice(position, position + query.length)) +
                '</mark>';

            from = position + query.length;
        }

        output += escapeHtml(value.slice(from));

        return output;
    }

    // Render search results
    function render(query = '') {
        const q = query.trim().toLowerCase();

        const matches = products.filter(product =>
            product.name.toLowerCase().includes(q)
        );

        $results.empty();

        matches.forEach(product => {
            const $card = $('<article>').addClass('a6-item');

            $('<img>')
                .attr({
                    src: product.image,
                    alt: product.name,
                    loading: 'lazy'
                })
                .appendTo($card);

            $('<h4>')
                .html(highlight(product.name, q))
                .appendTo($card);

            $('<p>')
                .text(product.price.toLocaleString('en-US') + ' ₸')
                .appendTo($card);

            $results.append($card);
        });

        $('#a6-count').text(matches.length + ' product(s) found');

        if (matches.length === 0) {
            $results.append(
                $('<p>').text('No products found. Try another name.')
            );
        }

        // Search suggestions
        $suggestions.empty();

        if (q && matches.length) {
            matches.slice(0, 5).forEach(product => {
                const $button = $('<button>')
                    .attr('type', 'button')
                    .text(product.name)
                    .on('click', function () {
                        $search.val(product.name);
                        render(product.name);
                        $suggestions.hide().prop('hidden', true);
                    });

                $('<li>').append($button).appendTo($suggestions);
            });

            $suggestions.prop('hidden', false).show();
        } else {
            $suggestions.hide().prop('hidden', true);
        }
    }

    // Search input
    $search.on('input', function () {
        render($(this).val());
    });

    // Escape key closes suggestions
    $search.on('keydown', function (event) {
        if (event.key === 'Escape') {
            $suggestions.hide().prop('hidden', true);
        }
    });

    // Close suggestions when clicking outside
    $(document).on('click', function (event) {
        if (!$(event.target).closest('.a6-search-wrap').length) {
            $suggestions.hide();
        }
    });

    render();

    // Scroll progress bar
    function progress() {
        const documentHeight = $(document).height();
        const windowHeight = $(window).height();

        const maxScroll = documentHeight - windowHeight;

        const percentage = maxScroll > 0
            ? Math.min(100, 100 * $(window).scrollTop() / maxScroll)
            : 100;

        $('#a6-progress').css('width', percentage + '%');
    }

    $(window).on('scroll resize', progress);

    progress();

    // Animated counters
    let counted = false;

    function animateCounters() {
        if (counted) return;

        const $stats = $('.a6-stats');

        if (!$stats.length) return;

        const statsPosition = $stats.offset().top;
        const visiblePosition = $(window).scrollTop() + $(window).height() - 40;

        if (statsPosition < visiblePosition) {
            counted = true;

            $('.a6-counter').each(function () {
                const $element = $(this);
                const target = Number($element.data('target'));

                if (!Number.isFinite(target)) return;

                $({ value: 0 }).animate(
                    { value: target },
                    {
                        duration: 1300,

                        step: function (value) {
                            $element.text(Math.floor(value));
                        },

                        complete: function () {
                            $element.text(target + '+');
                        }
                    }
                );
            });
        }
    }

    $(window).on('scroll resize', animateCounters);

    animateCounters();

    // Toast notification
    let toastTimer;

    function toast(message) {
        clearTimeout(toastTimer);

        $('#a6-toast')
            .stop(true, true)
            .text(message)
            .fadeIn(200);

        toastTimer = setTimeout(() => {
            $('#a6-toast').fadeOut(400);
        }, 2400);
    }

    // Form submission
    $('#a6-form').on('submit', function (event) {
        event.preventDefault();

        const name = $('#a6-name').val().trim();
        const message = $('#a6-message').val().trim();
        const feedback = $('#a6-form-feedback');
        if (!name || name.length > 60 || !message || message.length > 500) {
            feedback.text('Enter your name (1–60 characters) and a message (1–500 characters).');
            return;
        }

        const $button = $('#a6-submit');

        $button
            .prop('disabled', true)
            .html('<span class="a6-spinner" aria-hidden="true"></span> Please wait...');

        feedback.text('Processing your demo message...');

        const form = this;

        setTimeout(() => {
            $button.prop('disabled', false).text('Submit');

            feedback.text('Message checked successfully (demo only).');

            toast('Form submitted successfully!');

            form.reset();
        }, 1400);
    });

    // Copy text to clipboard
    $('#a6-copy').on('click', async function () {
        const value = $('#a6-copy-text').val();

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(value);
            } else {
                const input = document.getElementById('a6-copy-text');

                if (!input) {
                    throw new Error('Copy field not found');
                }

                input.select();

                if (!document.execCommand('copy')) {
                    throw new Error('Copy failed');
                }

                input.setSelectionRange(0, 0);
            }

            $('#a6-copy')
                .text('✓ Copied!');

            $('#a6-copy-status')
                .text('Copied to clipboard!')
                .addClass('a6-tooltip-visible');

            toast('Copied to clipboard!');

            setTimeout(() => {
                $('#a6-copy').text('Copy');

                $('#a6-copy-status')
                    .text('')
                    .removeClass('a6-tooltip-visible');
            }, 1800);

        } catch (error) {
            console.warn('Clipboard error:', error);
            toast('Please select and copy the text manually.');
        }
    });

    // Lazy loading images
    const $lazyImages = $('.a6-lazy');

    function loadVisibleImages() {
        $lazyImages.each(function () {
            const $image = $(this);
            const source = $image.attr('data-src');

            if (!source) return;

            const imagePosition = $image.offset().top;
            const visiblePosition =
                $(window).scrollTop() + $(window).height() + 100;

            if (imagePosition < visiblePosition) {
                $image
                    .attr('src', source)
                    .removeAttr('data-src')
                    .addClass('a6-loaded');
            }
        });
    }

    $(window).on('scroll resize', loadVisibleImages);

    loadVisibleImages();
});

