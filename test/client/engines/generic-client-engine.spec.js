'use strict';

import { GenericEngine } from '@client/engines/generic-client-engine';

describe('GenericEngine', function () {
    describe('constructor()', function () {
        it('should have instantiated GenericEngine', function () {
            const addEventListenerSpy = vi.spyOn(window, 'addEventListener').mockImplementation(() => {});
            const engine = new GenericEngine();
            addEventListenerSpy.mockRestore();
            expect(engine).toBeTruthy();
        });
    });
});
