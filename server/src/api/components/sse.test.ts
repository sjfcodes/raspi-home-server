/**
 * @group ut
*/
import { SseManager, sseErrorMessage } from './sse';

const req = {
    on: jest.fn(),
};
const res = {
    flush: jest.fn(),
    write: jest.fn(),
    writeHead: jest.fn(),
};

const req2 = {
    on: jest.fn(),
};
const res2 = {
    flush: jest.fn(),
    write: jest.fn(),
    writeHead: jest.fn(),
};

afterEach(()=>{
    req.on.mockClear()
    req2.on.mockClear()

    res.flush.mockClear()
    res2.flush.mockClear()
    res.write.mockClear()
    res2.write.mockClear()
    res.writeHead.mockClear()
    res2.writeHead.mockClear()
})

describe('sse store manager', () => {
    test('setPath throws if item missing item id', () => {
        const testStore = new SseManager({});
        expect(() => testStore.setState('', {})).toThrow(
            sseErrorMessage.missingItemId
        );
    });
    test('setPath throws when path not set.', () => {
        const testStore = new SseManager({});
        expect(() => testStore.setState('', {})).toThrow(
            sseErrorMessage.missingItemId
        );
    });
    test('setState updates an item in state when path is set', () => {
        const testStore = new SseManager({} as Record<string, any>);
        testStore.setPath('/test');
        testStore.setState('itemId', { key: 'value' });

        const item = testStore.getState()['itemId'];
        expect(item?.key).toEqual('value');
    });

    test('subscribe adds subscriber', () => {
        const testStore = new SseManager({} as Record<string, any>);
        testStore.setPath('/test');

        expect(testStore.getSubCount()).toEqual(0);

        // @ts-expect-error mocking
        testStore.subscribe(req, res);
        expect(res.writeHead).toHaveBeenCalled();
        expect(res.write).toHaveBeenCalled();
        expect(res.flush).toHaveBeenCalled();
        expect(req.on).toHaveBeenCalled();
        expect(testStore.getSubCount()).toEqual(1);
    });
    test('publish throws path not set', () => {
        const testStore = new SseManager({});
        expect(() => testStore.setState('itemId', {})).toThrow(
            sseErrorMessage.missingPath
        );
    });
    test('publish throws path not set', () => {
        const testStore = new SseManager({});
        expect(() => testStore.setState('itemId', {})).toThrow(
            sseErrorMessage.missingPath
        );
    });
    test('publish calls list of subs', () => {
        const testStore = new SseManager({} as Record<string, any>);
        testStore.setPath('/test');

        // @ts-expect-error mocking 
        testStore.subscribe(req, res);
        expect(res.write).toHaveBeenCalledTimes(1);
        testStore.publish();
        expect(res.write).toHaveBeenCalledTimes(2);
        
        // @ts-expect-error mocking 
        testStore.subscribe(req2, res2)
        expect(res2.write).toHaveBeenCalledTimes(1);
        testStore.publish();
        expect(res2.write).toHaveBeenCalledTimes(2);
        expect(res.write).toHaveBeenCalledTimes(3);


    });
});
