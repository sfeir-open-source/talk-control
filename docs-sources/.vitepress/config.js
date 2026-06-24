export default {
    title: 'TalkControl',
    description: 'TalkControl documentation',
    base: '/',
    ignoreDeadLinks: 'localhostLinks',
    themeConfig: {
        nav: [
            { text: 'User guide', link: '/users/' },
            { text: 'Developer guide', link: '/developers/' },
            { text: 'JsDoc', link: '/developers/code/' },
        ],
        sidebar: {
            '/users/': [{ text: 'User Guide', link: '/users/' }],
            '/developers/': [{ text: 'Developer Guide', link: '/developers/' }],
        },
        editLink: {
            pattern: 'https://github.com/sfeir-open-source/talk-control/edit/master/docs-sources/:path',
        },
        sidebarMenuLabel: 'Menu',
    },
}
