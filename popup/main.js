const bookmarksButton = document.querySelector('#bookmarks-button');
bookmarksButton.addEventListener('click', (event) => {
    const activeTabs = browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    activeTabs.then((tabs) => {
        const destination = 'https://app.flus.fr/links/new?url='+encodeURIComponent(tabs[0].url);
        browser.tabs.create({
            url: destination,
        });
    });
});
