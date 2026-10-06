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

    // 学習アプリ（Academy）への導線。流入元（UTM）と紹介コード（?ref=）をアプリへ引き継ぐ。
    // アプリの /signup・/login は ?ref= を読み取り、登録時に紹介者へ紐づける。
    var APP_ORIGIN = 'https://ministud-academy-671080863342.asia-northeast1.run.app';
    var CARRY_KEYS = ['ref', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    var STORE_KEY = 'ministud-hp-attribution';

    function readAttribution() {
        var stored = {};
        try { stored = JSON.parse(sessionStorage.getItem(STORE_KEY) || '{}') || {}; } catch (e) { stored = {}; }
        var params = new URLSearchParams(location.search);
        var found = false;
        CARRY_KEYS.forEach(function (key) {
            var value = params.get(key);
            if (value) { stored[key] = value; found = true; }
        });
        if (found) {
            try { sessionStorage.setItem(STORE_KEY, JSON.stringify(stored)); } catch (e) { /* private mode */ }
        }
        return stored;
    }

    var attribution = readAttribution();
    var pageName = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';

    document.querySelectorAll('a[href^="' + APP_ORIGIN + '"]').forEach(function (link) {
        var url;
        try { url = new URL(link.href); } catch (e) { return; }
        if (attribution.ref) url.searchParams.set('ref', attribution.ref);
        url.searchParams.set('utm_source', attribution.utm_source || 'ministud.pro');
        url.searchParams.set('utm_medium', attribution.utm_medium || (attribution.utm_source ? 'referral' : 'website'));
        url.searchParams.set('utm_campaign', attribution.utm_campaign || 'hp');
        if (attribution.utm_term) url.searchParams.set('utm_term', attribution.utm_term);
        url.searchParams.set('utm_content', attribution.utm_content || pageName);
        link.href = url.toString();

        link.addEventListener('click', function () {
            if (typeof window.gtag !== 'function') return;
            window.gtag('event', url.pathname === '/signup' ? 'app_signup_click' : 'app_link_click', {
                link_url: url.origin + url.pathname,
                link_text: (link.textContent || '').trim().slice(0, 40),
                page: pageName,
                transport_type: 'beacon'
            });
        });
    });

    document.querySelectorAll('a[href^="https://forms.gle/"]').forEach(function (link) {
        link.addEventListener('click', function () {
            if (typeof window.gtag !== 'function') return;
            window.gtag('event', 'contact_form_click', { page: pageName, transport_type: 'beacon' });
        });
    });
}());
