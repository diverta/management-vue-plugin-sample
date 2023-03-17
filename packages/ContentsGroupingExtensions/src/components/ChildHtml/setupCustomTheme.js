export default function setupCustomTheme(monaco, fontSize) {
    monaco.editor.defineTheme('rcms-vs', {
        base: 'vs',
        inherit: true,
        rules: [
            {
                token: 'smarty.command',
                foreground: '000080',
                fontStyle: 'bold',
                fontSize,
            },
            {
                token: 'smarty.variable',
                foreground: 'db7f29',
                fontStyle: 'bold',
            },
            {
                token: 'smarty.modifier',
                foreground: '000080',
            },
        ],
        colors: {
            'editor.foreground': '#000080',
        },
    });

    monaco.editor.defineTheme('rcms-vs-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            {
                token: 'smarty.command',
                foreground: 'ffaa17',
                fontStyle: 'bold',
                fontSize,
            },
            {
                token: 'smarty.variable',
                foreground: '9cdcfe',
                fontStyle: 'bold',
            },
            {
                token: 'smarty.modifier',
                foreground: 'ffaa17',
            },
        ],
        colors: {
            'editor.foreground': '#ffaa17',
        },
    });

    monaco.editor.defineTheme('rcms-hc-black', {
        base: 'hc-black',
        inherit: true,
        rules: [
            {
                token: 'smarty.command',
                foreground: 'ffc700',
                fontStyle: 'bold',
                fontSize,
            },
            {
                token: 'smarty.variable',
                foreground: '7deffe',
                fontStyle: 'bold',
            },
            {
                token: 'smarty.modifier',
                foreground: 'ffc700',
            },
        ],
        colors: {
            'editor.foreground': '#ffc700',
        },
    });
}
