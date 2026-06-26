'use strict';

import { loadPluginModule } from '@plugins/plugin-loader';

describe('loadPluginModule', function () {
    it('should return a Promise for "keyboardInput"', async function () {
        const result = loadPluginModule('keyboardInput');
        expect(result.then).toBeTypeOf('function');
        await result;
    });

    it('should return a Promise for "touchInput"', async function () {
        const result = loadPluginModule('touchInput');
        expect(result.then).toBeTypeOf('function');
        await result;
    });

    it('should return a Promise for "touchPointerInput"', async function () {
        const result = loadPluginModule('touchPointerInput');
        expect(result.then).toBeTypeOf('function');
        await result;
    });

    it('should return a resolved Promise for unknown plugin name', function () {
        const result = loadPluginModule('unknownPlugin');
        expect(result.then).toBeTypeOf('function');
        return result.then(value => {
            expect(value).toBeUndefined();
        });
    });

    it('should return a Promise for undefined name', function () {
        const result = loadPluginModule(undefined);
        expect(result.then).toBeTypeOf('function');
        return result.then(value => {
            expect(value).toBeUndefined();
        });
    });
});
