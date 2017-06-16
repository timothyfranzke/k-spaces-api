commandCenterApp.config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('spaces-light', {
        '50': '#55c3d4',
        '100': '#55c3d4',
        '200': '#55c3d4',
        '300': '#55c3d4',
        '400': '#55c3d4',
        '500': '#55c3d4',
        '600': '#55c3d4',
        '700': '#55c3d4',
        '800': '#55c3d4',
        '900': '#55c3d4',
        'A100': '#55c3d4',
        'A200': '#55c3d4',
        'A400': '#55c3d4',
        'A700': '#55c3d4',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.definePalette('spaces-dark', {
        '50': '#2a4362',
        '100': '#2a4362',
        '200': '#2a4362',
        '300': '#2a4362',
        '400': '#2a4362',
        '500': '#2a4362',
        '600': '#2a4362',
        '700': '#2a4362',
        '800': '#2a4362',
        '900': '#2a4362',
        'A100': '#2a4362',
        'A200': '#2a4362',
        'A400': '#2a4362',
        'A700': '#2a4362',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('default')
        .primaryPalette('spaces-light')
        // If you specify less than all of the keys, it will inherit from the
        // default shades
        .accentPalette('spaces-dark', {
            'default': '600' // use shade 200 for default, and keep all other shades the same
        });
});
commandCenterApp.config(function ($provide) {
    $provide.decorator('$uiViewScroll', function ($delegate) {
        return function (uiViewElement) {
            // var top = uiViewElement.getBoundingClientRect().top;
            // window.scrollTo(0, (top - 30));
            // Or some other custom behaviour...
        };
    });
});