// Assignment 5: DOM, events, callbacks, objects, arrays, loops, sounds and animations.

document.addEventListener('DOMContentLoaded', () => {
    const $ = selector => document.querySelector(selector);
    const $$ = selector => [...document.querySelectorAll(selector)];

    const feedback = $('#a5-feedback');

    const notify = message => {
        if (feedback) feedback.textContent = message;
    };

    // Products array
    const products = [
        { name: 'Chocolate Cake', category: 'cakes', price: 2500, image: 'images/chocolate-cake.jpg' },
        { name: 'Vanilla Cake', category: 'cakes', price: 2300, image: 'images/vanilla-cake.jpg' },
        { name: 'Donut', category: 'pastries', price: 700, image: 'images/donut.jpg' },
        { name: 'Cookies', category: 'pastries', price: 850, image: 'images/cookies.jpg' },
        { name: 'Croissant', category: 'pastries', price: 950, image: 'images/croissant.jpg' },
        { name: 'Latte', category: 'drinks', price: 1200, image: 'images/latte.jpg' },
        { name: 'Milkshake', category: 'drinks', price: 1500, image: 'images/milkshake.jpg' },
        { name: 'Banana Caramel Shake', category: 'drinks', price: 1600, image: 'images/banana-caramel-shake.jpg' },
        { name: 'Strawberry Milkshake', category: 'drinks', price: 1500, image: 'images/milkshake-2.jpg' },
        { name: 'Chocolate Shake', category: 'drinks', price: 1600, image: 'images/milkshake.jpg' },
        { name: 'Green Tea', category: 'drinks', price: 900, image: 'images/green-tea.jpg' }
    ];

    const money = value => `${value.toLocaleString('en-US')} ₸`;

    // Shopping cart
    const storageKey = 'hm-bakery-a5-cart';

    let stored = [];

    try {
        stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
        stored = [];
    }

    const cart = {
        items: Array.isArray(stored)
            ? stored.filter(item =>
                item &&
                products.some(product => product.name === item.name) &&
                Number.isInteger(item.qty) &&
                item.qty > 0 &&
                item.qty <= 99
            )
            : [],

        add(product) {
            const line = this.items.find(item => item.name === product.name);

            if (line) {
                line.qty = Math.min(99, line.qty + 1);
            } else {
                this.items.push({ name: product.name, qty: 1 });
            }

            this.save();
        },

        change(name, delta) {
            const line = this.items.find(item => item.name === name);
            if (!line) return;

            line.qty += delta;

            if (line.qty <= 0) {
                this.items = this.items.filter(item => item.name !== name);
            }

            this.save();
        },

        remove(name) {
            this.items = this.items.filter(item => item.name !== name);
            this.save();
        },

        clear() {
            this.items = [];
            this.save();
        },

        count() {
            return this.items.reduce((sum, item) => sum + item.qty, 0);
        },

        total() {
            return this.items.reduce((sum, item) => {
                const product = products.find(p => p.name === item.name);
                return sum + (product ? product.price * item.qty : 0);
            }, 0);
        },

        save() {
            try {
                localStorage.setItem(storageKey, JSON.stringify(this.items));
            } catch (error) {
                console.warn('Could not save cart:', error);
            }

            renderCart();
        }
    };

    // Notification sound
    function playNotification() {
        try {
            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) return;

            const context = new AudioContextClass();
            const oscillator = context.createOscillator();
            const gain = context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = 660;

            gain.gain.setValueAtTime(0.06, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(
                0.001,
                context.currentTime + 0.16
            );

            oscillator.connect(gain);
            gain.connect(context.destination);

            oscillator.start();
            oscillator.stop(context.currentTime + 0.17);

            oscillator.onended = () => context.close();
        } catch (error) {
            console.info('Sound unavailable:', error);
        }
    }

    // Render shopping cart
    function renderCart() {
        const count = $('#a5-cart-count');

        if (count) {
            count.textContent = cart.count();
        }

        const summary = $('#a5-cart');

        if (summary) {
            summary.textContent =
                `Cart: ${cart.count()} items · ${money(cart.total())}`;
        }

        const lines = $('#a5-cart-lines');
        if (!lines) return;

        lines.replaceChildren();

        if (cart.items.length === 0) {
            const empty = document.createElement('p');
            empty.textContent = 'Your cart is empty. Add something delicious!';
            lines.append(empty);
        }

        cart.items.forEach(item => {
            const product = products.find(p => p.name === item.name);
            if (!product) return;

            const row = document.createElement('div');
            row.className = 'a5-cart-line';

            const name = document.createElement('strong');
            name.textContent = product.name;

            const price = document.createElement('span');
            price.textContent = money(product.price * item.qty);

            const controls = document.createElement('div');
            controls.className = 'a5-cart-controls';

            const actions = [
                ['−', 'minus', 'Decrease'],
                [String(item.qty), 'none', 'Quantity'],
                ['+', 'plus', 'Increase'],
                ['Remove', 'remove', 'Remove']
            ];

            actions.forEach(([label, action, title]) => {
                if (action === 'none') {
                    const quantity = document.createElement('span');
                    quantity.textContent = label;
                    controls.append(quantity);
                    return;
                }

                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'a5-btn';
                button.textContent = label;
                button.setAttribute('aria-label', `${title} ${product.name}`);
                button.dataset.action = action;
                button.dataset.product = product.name;

                controls.append(button);
            });

            row.append(name, price, controls);
            lines.append(row);
        });

        const total = $('#a5-cart-total');

        if (total) {
            total.textContent = `Total: ${money(cart.total())}`;
        }
    }

    // Add product to cart
    function addToCart(name, button) {
        const product = products.find(
            p => p.name.toLowerCase() === String(name).toLowerCase()
        );

        if (!product) {
            notify(`Product ${name} is not available in the demo cart.`);
            return;
        }

        cart.add(product);
        playNotification();

        notify(`${product.name} added to cart!`);

        const toast = $('#a5-toast');

        if (toast) {
            toast.textContent = `${product.name} added to cart!`;
        }

        if (button) {
            button.classList.add('a5-pop');

            setTimeout(() => {
                button.classList.remove('a5-pop');
            }, 350);
        }
    }

    renderCart();

    // Cart drawer
    $('#a5-cart-toggle')?.addEventListener('click', () => {
        const drawer = $('#a5-cart-drawer');
        if (!drawer) return;

        drawer.hidden = !drawer.hidden;

        $('#a5-cart-toggle').setAttribute(
            'aria-expanded',
            String(!drawer.hidden)
        );

        if (!drawer.hidden) {
            $('#a5-cart-close')?.focus();
        }
    });

    $('#a5-cart-close')?.addEventListener('click', () => {
        const drawer = $('#a5-cart-drawer');
        if (drawer) drawer.hidden = true;

        $('#a5-cart-toggle')?.setAttribute('aria-expanded', 'false');
        $('#a5-cart-toggle')?.focus();
    });

    $('#a5-cart-clear')?.addEventListener('click', () => {
        cart.clear();
    });

    $('#a5-cart-lines')?.addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const name = button.dataset.product;

        switch (button.dataset.action) {
            case 'plus':
                cart.change(name, 1);
                break;
            case 'minus':
                cart.change(name, -1);
                break;
            case 'remove':
                cart.remove(name);
                break;
        }
    });

    document.addEventListener('keydown', event => {
        const drawer = $('#a5-cart-drawer');

        if (event.key === 'Escape' && drawer && !drawer.hidden) {
            $('#a5-cart-close')?.click();
        }
    });

    $$('.a5-order').forEach(button => {
        button.addEventListener('click', () => {
            addToCart(button.dataset.product, button);
        });
    });

    // Drink filters
    const drinkCards = $$('#a5-drink-grid [data-drink-type]');

    $$('[data-drink-filter]').forEach(button => {
        button.addEventListener('click', () => {
            const selected = button.dataset.drinkFilter;

            drinkCards.forEach(card => {
                card.hidden =
                    selected !== 'all' &&
                    card.dataset.drinkType !== selected;
            });

            $$('[data-drink-filter]').forEach(filterButton => {
                const active = filterButton === button;

                filterButton.classList.toggle('active', active);
                filterButton.setAttribute('aria-pressed', String(active));
            });

            const status = $('#a5-drink-status');

            if (status) {
                const visibleCount =
                    drinkCards.filter(card => !card.hidden).length;

                status.textContent =
                    `Showing ${visibleCount} ${selected} drinks`;
            }
        });
    });

    // Render products
    const cards = $('#a5-products');

    function renderProducts(category = 'all') {
        if (!cards) return;

        const visibleProducts = products.filter(product =>
            category === 'all' || product.category === category
        );

        cards.replaceChildren();

        visibleProducts.forEach(product => {
            const card = document.createElement('article');
            card.className = 'a5-card';

            const image = document.createElement('img');
            image.src = product.image;
            image.alt = product.name;
            image.loading = 'lazy';

            const heading = document.createElement('h3');
            heading.textContent = product.name;

            const price = document.createElement('p');
            price.textContent = money(product.price);

            const button = document.createElement('button');
            button.className = 'a5-btn a5-add';
            button.type = 'button';
            button.textContent = 'Add to cart';
            button.dataset.name = product.name;

            button.addEventListener('click', () => {
                addToCart(product.name, button);
            });

            card.append(image, heading, price, button);
            cards.append(card);
        });
    }

    renderProducts();

    // Product category filters
    $$('.a5-filter').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category || 'all';

            $$('.a5-filter').forEach(filterButton => {
                filterButton.setAttribute(
                    'aria-pressed',
                    String(filterButton === button)
                );
            });

            renderProducts(category);
            notify(`Showing ${category} products.`);
        });
    });

    // Keep the older home-page theme control in sync with the shared site theme.
    const homeThemeButton = $('#a5-theme');
    if (homeThemeButton) {
        homeThemeButton.textContent =
            document.documentElement.dataset.theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        homeThemeButton.addEventListener('click', () => {
            const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = nextTheme;
            try {
                localStorage.setItem('hmBakeryTheme', nextTheme);
            } catch (error) {
                console.info('Theme preference could not be saved.');
            }
            homeThemeButton.textContent = nextTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
            document.dispatchEvent(new CustomEvent('hmBakeryThemeChange'));
        });
    }

    // Read more button
    $('#a5-more')?.addEventListener('click', () => {
        const extra = $('#a5-extra');
        if (!extra) return;

        extra.hidden = !extra.hidden;
        $('#a5-more').textContent = extra.hidden ? 'Read More' : 'Read Less';
    });

    // Star rating
    const stars = $$('.a5-star');

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            stars.forEach((item, i) => {
                const selected = i <= index;

                item.classList.toggle('selected', selected);
                item.setAttribute('aria-pressed', String(selected));
            });

            const rating = $('#a5-rating');

            if (rating) {
                rating.textContent = `Your rating: ${index + 1}/5`;
            }

            playNotification();
        });
    });

    // Display current time
    $('#a5-time')?.addEventListener('click', () => {
        const clock = $('#a5-clock');

        if (clock) {
            clock.textContent = new Date().toLocaleTimeString();
        }
    });

    // Keyboard navigation
    const nav = $$('.bakery-navbar .nav-link');

    nav.forEach((link, index) => {
        link.addEventListener('keydown', event => {
            if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;

            event.preventDefault();

            const direction = event.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = (index + direction + nav.length) % nav.length;

            nav[nextIndex]?.focus();
        });
    });

    // Multi-step form
    const steps = $$('.a5-step');
    let currentStep = 0;

    function showStep(index, callback) {
        steps.forEach((step, i) => {
            step.hidden = i !== index;
        });

        currentStep = index;

        if (callback) callback(index);
    }

    function stepStatus(index) {
        const status = $('#a5-step-status');

        if (status) {
            status.textContent = `Step ${index + 1} of ${steps.length}`;
        }
    }

    if (steps.length) {
        showStep(0, stepStatus);
    }

    $('#a5-next')?.addEventListener('click', () => {
        const nameInput = $('#a5-name');
        const emailInput = $('#a5-email');

        if (!nameInput || !emailInput) return;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!name || !validEmail) {
            notify('Enter a name and valid email first.');
            return;
        }

        if (steps.length > 1) {
            showStep(1, stepStatus);
        }

        notify('Now enter your bakery request.');
    });

    $('#a5-back')?.addEventListener('click', () => {
        if (steps.length > 0) {
            showStep(0, stepStatus);
        }
    });

    $('#a5-finish')?.addEventListener('click', () => {
        const request = $('#a5-request');

        if (!request || !request.value.trim()) {
            notify('Please enter your request.');
            return;
        }

        notify('Thank you! Your form passed the demo validation. No data was sent.');
        playNotification();
    });
});
