import largeColorOptions from './extra/large_color_palette.js';
import plugins from './plugins';

const IFRAMELY_IFRAME_SRC = 'https://iframely.kuroco-front.app/api/iframe';
const IFRAMELY_API_KEY = 'abb7c0493ea4ec2707998a'; //たまに変更する

const CKFINDER_UPLOAD_URL =
    '/management/wysiwyg/ckfinder/3.5.1/core/connector/php/connector.php?command=QuickUpload&type=default__public&responseType=json';

export function createCkfinderConfig(option = {}) {
    const url = new URL(CKFINDER_UPLOAD_URL, location.origin);
    if (option.upload_dir !== '') {
        url.searchParams.set('currentFolder', option.upload_dir);
    }
    const resourcePath = option.resourcePath || '';
    const resourceType = resourcePath !== '' ? resourcePath.replaceAll('/', '_-_') : 'default__public,s3__public';
    if (resourcePath !== '') {
        const type = resourcePath.replaceAll('/', '_-_');
        url.searchParams.set('type', `default__public_${type}`);
    }

    return {
        uploadUrl: url.toString(),
        options: {
            resourceType,
        },
    };
}

export function filterItems(items = [], removePlugins = '') {
    const plugins = removePlugins
        .split(',')
        .map(p => p.trim())
        .filter(p => p !== '');
    return items.filter(item => !plugins.includes(item));
}

export function craeteFontColor(option = {}) {
    if (option.largeColorPalette === 'true') {
        return { columns: 10, colors: largeColorOptions };
    }
    if (typeof option.customColors === 'string') {
        const customColors = option.customColors.split(',').map(val => ({ color: val, label: val }));
        return { colors: customColors };
    }
}

export function createFontBackgroundColor(option = {}) {
    if (option.largeColorPalette === 'true') {
        return { columns: 10, colors: largeColorOptions };
    }
    if (typeof option.customColors === 'string') {
        const customColors = option.customColors.split(',').map(val => ({ color: val, label: val }));
        return { colors: customColors };
    }
}

export default function buildConfig(option = {}) {
    const toolbarItems =
        option.toolbar === 'basic'
            ? ['bold', 'italic', '|', 'numberedList', 'bulletedList', '|', 'link']
            : [
                  'SourceEditing',
                  'fullScreen',
                  '|',
                  'heading',
                  'alignment',
                  '|',
                  'bold',
                  'italic',
                  'underline',
                  '|',
                  'ckfinder',
                  'insertImage',
                  'mediaEmbed',
                  'link',
                  'insertTable',
                  '|',
                  'fontSize',
                  'fontColor',
                  'fontBackgroundColor',
                  'fontFamily',
                  '|',
                  'bulletedList',
                  'numberedList',
                  'blockQuote',
                  'codeBlock',
                  'undo',
                  'redo',
                  'findAndReplace',
              ];

    return {
        toolbar: {
            items: filterItems(toolbarItems, option.removePlugins),
        },
        image: {
            toolbar: [
                'imageStyle:alignLeft',
                'imageStyle:alignCenter',
                'imageStyle:alignRight',
                '|',
                'imageTextAlternative',
                'toggleImageCaption',
                'imageResize',
                'linkImage',
            ],
            insert: {
                type: 'block',
            },
            styles: ['alignLeft', 'alignCenter', 'alignRight'],
        },
        language: option.lang || 'en',
        plugins,
        ckfinder: createCkfinderConfig(option),
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
        },
        heading: {
            options: [
                { model: 'paragraph', title: 'P', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'H1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'H2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'H3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'H4', class: 'ck-heading_heading4' },
            ],
        },
        allow: [
            {
                name: /.*/,
                attributes: true,
                classes: true,
                styles: true,
            },
        ],
        fontSize: {
            options: option.use_font_size_px
                ? ['default', 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
                : ['tiny', 'small', 'default', 'big', 'huge'],
        },
        fontColor: craeteFontColor(option),
        fontBackgroundColor: createFontBackgroundColor(option),
        // Configure 'mediaEmbed' with Iframely previews.
        mediaEmbed: {
            // Previews are always enabled if there’s a provider for a URL (below regex catches all URLs)
            // By default `previewsInData` are disabled, but let’s set it to `false` explicitely to be sure
            previewsInData: false,

            providers: [
                {
                    // hint: this is just for previews. Get actual HTML codes by making API calls from your CMS
                    name: 'iframely previews',

                    // Match all URLs or just the ones you need:
                    url: /.+/,

                    html: match => {
                        const url = match[0];

                        const iframeUrl =
                            IFRAMELY_IFRAME_SRC +
                            '?app=1&api_key=' +
                            IFRAMELY_API_KEY +
                            '&url=' +
                            encodeURIComponent(url);
                        // alternatively, use &key= instead of &api_key with the MD5 hash of your api_key
                        // more about it: https://iframely.com/docs/allow-origins

                        return (
                            // If you need, set maxwidth and other styles for 'iframely-embed' class - it's yours to customize
                            '<div class="iframely-embed">' +
                            '<div class="iframely-responsive">' +
                            `<iframe src="${iframeUrl}" ` +
                            'frameborder="0" allow="autoplay; encrypted-media" loading="lazy" allowfullscreen>' +
                            '</iframe>' +
                            '</div>' +
                            '</div>'
                        );
                    },
                },
            ],
        },
    };
}
