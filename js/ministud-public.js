(function () {
    'use strict';

    document.querySelectorAll(
        'body > #preloader, body > header, body > .side-mobile-menu, body > .body-overlay, ' +
        'body > .header-search-details, body > main, body > footer, body > #scroll'
    ).forEach(function (legacyElement) {
        legacyElement.remove();
    });

    var menuButton = document.querySelector('.ms-menu-button');
    var navigation = document.querySelector('.ms-nav');

    if (menuButton && navigation) {
        menuButton.addEventListener('click', function () {
            var isOpen = navigation.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', String(isOpen));
            menuButton.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
        });

        navigation.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navigation.classList.remove('open');
                menuButton.setAttribute('aria-expanded', 'false');
                menuButton.setAttribute('aria-label', 'メニューを開く');
            });
        });
    }

    var countryButtons = document.querySelectorAll('.ms-country-tabs button');
    var countryPanels = document.querySelectorAll('.ms-country-panel');

    countryButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var country = button.getAttribute('data-country');

            countryButtons.forEach(function (item) {
                var selected = item === button;
                item.classList.toggle('active', selected);
                item.setAttribute('aria-selected', String(selected));
            });

            countryPanels.forEach(function (panel) {
                var active = panel.getAttribute('data-panel') === country;
                panel.classList.toggle('active', active);
                panel.hidden = !active;
            });
        });
    });
}());
