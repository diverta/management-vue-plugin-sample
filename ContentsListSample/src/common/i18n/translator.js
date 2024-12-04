const sqlite3 = require('better-sqlite3');

const defaultOptions = {
    dbfile_path: '../../../nfs/lib/i18n.db',
};

/*
 * Crawls the source and tries to fetch all labels to be translated
 */
function crawl(source) {
    // Looking for labels to translate
    const pattern = /translate\(\s*["']([^"']+)["']\s*[\),]/gi; // eslint-disable-line no-useless-escape
    const labels = [];
    let matches = null;
    while ((matches = pattern.exec(source))) {
        labels.push(matches[1]);
    }

    return labels;
}

/*
 * Translates an Array of labels
 */
function translate(labels, options = {}) {
    options = {
        ...defaultOptions,
        ...options,
    };

    const db = new sqlite3(options.dbfile_path, { readonly: true });
    const stmt = db.prepare('select language, key, text from t_translation where key = ?');
    const out_labels = {};
    for (const label of labels) {
        const rows = stmt.all(label);
        out_labels[label] = {};
        for (const row of rows) {
            out_labels[label][row.language] = row.text;
        }
    }
    db.close();

    return out_labels;
}

module.exports = {
    crawl,
    translate,
};
