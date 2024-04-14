export const config = {
    log: {
        includeBody: false,
        includeMethods: [
            'GET',
            'POST',
            'PUT',
        ],
        includeSsePublish: true,
        labelWidth: 23,
    },
};
