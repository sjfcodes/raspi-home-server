// [TODO] move to globals?
export const config = {
    log: {
        includeBody: true,
        includeMethods: [
            'GET',
            'POST',
            'PUT',
        ],
        includeSsePublish: true,
        labelWidth: 23,
    },
};
