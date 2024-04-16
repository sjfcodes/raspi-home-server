/**
 * @group ut
 */

import { getThermostats } from "./store";

describe('getThermostats', ()=>{
    test('should return empty store', () => {
        expect(getThermostats()).toEqual({});
    });
});
