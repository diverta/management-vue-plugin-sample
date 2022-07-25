/**
 * The target ext contents types (shuold be ignored when other values specified).
 */
export const EXT_TYPE = {
    Text: 0,
    Textarea: 1,
    Selectbox: 2,
    Image: 4,
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
