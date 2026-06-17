'use strict';

import 'module-alias/register';
import { assert } from 'chai';
import { loadPluginModule } from '@plugins/plugin-loader';

describe('loadPluginModule', function () {
    it('should return a Promise for "keyboardInput"', function () {
        const result = loadPluginModule('keyboardInput');
        assert.isFunction(result.then, '"keyboardInput" result should be a Promise (has .then)');
    });

    it('should return a Promise for "touchInput"', function () {
        const result = loadPluginModule('touchInput');
        assert.isFunction(result.then, '"touchInput" result should be a Promise (has .then)');
    });

    it('should return a Promise for "touchPointerInput"', function () {
        const result = loadPluginModule('touchPointerInput');
        assert.isFunction(result.then, '"touchPointerInput" result should be a Promise (has .then)');
    });

    it('should return a resolved Promise for unknown plugin name', function () {
        const result = loadPluginModule('unknownPlugin');
        assert.isFunction(result.then, 'default case should return a Promise (has .then)');
        return result.then(value => {
            assert.isUndefined(value, 'default case should resolve to undefined');
        });
    });

    it('should return a Promise for undefined name', function () {
        const result = loadPluginModule(undefined);
        assert.isFunction(result.then, 'undefined name should return a Promise');
        return result.then(value => {
            assert.isUndefined(value, 'undefined name should resolve to undefined');
        });
    });
});
