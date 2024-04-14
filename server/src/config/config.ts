// [TODO] move to globals?
export const config = {
    log: {
        includeData: true,
        includeMethods: [
            // 'GET',
            // 'POST',
            'PUT',
        ],
        includeSsePublish: true,
        includeSseSubScribe: true,
        includeSseUnsubScribe: true,
        labelWidth: 23,
    },
};
