export function cleanTrackingParams() {
    const paramsToRemove = ['utm_source', 'utm_medium', 'utm_content', 'utm_term', 'utm_campaign', 'fbclid'];

    try {
        const url = new URL(window.location.href);
        let changed = false;

        paramsToRemove.forEach((key) => {
            if (url.searchParams.has(key)) {
                url.searchParams.delete(key);
                changed = true;
            }
        });

        if (changed) {
            const newSearch = url.searchParams.toString();
            const newUrl = url.pathname + (newSearch ? `?${newSearch}` : '') + url.hash;
            history.replaceState(null, '', newUrl);
        }
    } catch (error) {
        console.debug('UTM strip failed:', error);
    }
}
