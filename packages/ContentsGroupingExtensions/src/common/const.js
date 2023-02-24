/**
 * The target ext contents types (shuold be ignored when other values specified).
 */
export const EXT_TYPE = {
    Text: 0,
    Textarea: 1,
    Selectbox: 2,
    Image: 4,
    MultipleCheckbox: 5,
    Wysiwyg: 6,
    Link: 7,
    FileManager: 30,
    Map: 11,
    // TextAutocomplete: 13,
    // RelationField: 20,
    // Html: 21,
    // ApiField: 32,
    // Counter: 34,
};

export const getExtTypeByValue = value => {
    const objectFlip = obj => {
        const ret = {};
        Object.keys(obj).forEach(key => {
            ret[obj[key]] = key;
        });
        return ret;
    };
    return objectFlip(EXT_TYPE)[value];
};
