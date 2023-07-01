module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                // options placed here will be merged with default configuration and passed to electron-builder
                appId: 'com.maizesoft.fish-book',
                productName: 'fish-book',
                win: {
                    icon: 'public/app-icon.ico',
                },
                afterSign: 'build/provisioning/notarize.js',
                mac: {
                    target: {
                        target: 'zip',
                        arch: 'universal',
                    },
                    hardenedRuntime: true,
                    provisioningProfile: 'build/provisioning/fish-bookDevIDApp.provisionprofile',
                    entitlements: 'build/provisioning/mac.entitlement',
                },
                linux: {
                    target: {
                        target: 'appimage',
                        arch: ['armv7l'],
                    },
                },
                extraResources: [
                    {
                        from: 'books',
                        to: 'books',
                    },
                ],
                nsis: {
                    oneClick: false,
                    allowToChangeInstallationDirectory: true,
                },
            },
        },
    },
};
