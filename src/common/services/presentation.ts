function resolveUrl(patcherUrl: string): string {
    const url = sessionStorage.getItem('presentationUrl') ?? '';

    if (url.includes('tc-presentation-url')) {
        const presentationUrl = url.split('tc-presentation-url=')[1];
        return `${patcherUrl}/patcher?tc-presentation-url=${presentationUrl}`;
    }
    return url;
}

function saveUrlForPatching(url: string): void {
    let magicUrl = url;
    if (!url.includes('tc-presentation-url')) magicUrl = `tc-presentation-url=${url}`;
    sessionStorage.setItem('presentationUrl', magicUrl);
}

export default { resolveUrl, saveUrlForPatching };
