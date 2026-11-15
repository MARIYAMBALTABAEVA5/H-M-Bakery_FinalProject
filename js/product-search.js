
// H&M Bakery - Product Search and Filtering

document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.querySelector('#product-search');
    const categorySelect = document.querySelector('#product-category');
    const resetButton = document.querySelector('#reset-product-search');

    const products = document.querySelectorAll('.product-item');
    const resultsCount = document.querySelector('#product-results-count');
    const noProductsMessage = document.querySelector('#no-products-message');

    const STORAGE_KEY = 'hmBakeryProductFilters';

    if (!searchInput || !categorySelect || !resetButton) {
        return;
    }

    // Filter products
    function filterProducts() {

        const searchValue = searchInput.value.trim().toLowerCase();
        const selectedCategory = categorySelect.value;

        let visibleCount = 0;

        products.forEach(product => {

            const productName = product.dataset.name.toLowerCase();
            const productCategory = product.dataset.category;

            const matchesSearch = productName.includes(searchValue);

            const matchesCategory =
                selectedCategory === 'all' ||
                productCategory === selectedCategory;

            const isVisible = matchesSearch && matchesCategory;

            product.style.display = isVisible ? '' : 'none';

            if (isVisible) {
                visibleCount++;
            }

        });

        // Update results counter
        resultsCount.textContent =
            `Showing ${visibleCount} of ${products.length} products`;

        // Show or hide no-results message
        noProductsMessage.style.display =
            visibleCount === 0 ? 'block' : 'none';

        // Save current filters
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            search: searchValue,
            category: selectedCategory
        }));

    }

    // Restore saved filters
    function restoreFilters() {

        const savedFilters = localStorage.getItem(STORAGE_KEY);

        if (savedFilters) {

            try {

                const filters = JSON.parse(savedFilters);

                searchInput.value = filters.search || '';

                const validCategories = [
                    'all', 'cake', 'pastry', 'dessert', 'snack'
                ];

                categorySelect.value =
                    validCategories.includes(filters.category)
                        ? filters.category
                        : 'all';

            } catch (error) {

                localStorage.removeItem(STORAGE_KEY);

            }

        }

        filterProducts();

    }

    // Search while typing
    searchInput.addEventListener('input', filterProducts);

    // Filter by category
    categorySelect.addEventListener('change', filterProducts);

    // Reset filters
    resetButton.addEventListener('click', () => {

        searchInput.value = '';
        categorySelect.value = 'all';

        filterProducts();

        searchInput.focus();

    });

    // Initialize
    restoreFilters();

});
