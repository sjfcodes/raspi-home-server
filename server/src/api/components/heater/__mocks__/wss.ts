export const getWss = jest.fn().mockImplementation(() => {
    return {
        on: () => {},
    };
});
