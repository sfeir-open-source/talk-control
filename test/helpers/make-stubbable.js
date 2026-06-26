'use strict';
// esbuild compiles ESM exports as non-configurable getter-only properties (live bindings).
// sinon 9 stubs via simple assignment which silently fails on getter-only properties.
//
// Two-phase fix (must be required FIRST in .mocharc.yml, before tsx/cjs):
//
// Phase 1 — Object.defineProperty patch:
//   Makes ALL getter descriptors configurable at creation time.
//   This intercepts esbuild's __export({ get: () => X }) calls.
//
// Phase 2 — Module._load patch:
//   After each module loads, converts configurable getters to writable data properties.
//   Sinon's obj.prop = stub assignment then works normally.

const originalDefineProperty = Object.defineProperty;
Object.defineProperty = function (obj, prop, descriptor) {
    if (descriptor && typeof descriptor.get === 'function' && !descriptor.configurable) {
        descriptor = Object.assign({}, descriptor, { configurable: true });
    }
    return originalDefineProperty.call(Object, obj, prop, descriptor);
};

const Module = require('module');
const originalLoad = Module._load;

Module._load = function (_request, _parent, _isMain) {
    const mod = originalLoad.apply(this, arguments);
    if (mod && typeof mod === 'object') {
        try {
            for (const key of Object.getOwnPropertyNames(mod)) {
                const desc = Object.getOwnPropertyDescriptor(mod, key);
                if (desc && typeof desc.get === 'function' && desc.configurable) {
                    try {
                        const value = desc.get();
                        // Skip undefined values: module might be partially loaded
                        // (circular dependency). A second Module._load call for
                        // the same module (after full execution) will convert it.
                        if (value !== undefined) {
                            originalDefineProperty.call(Object, mod, key, {
                                value,
                                writable: true,
                                enumerable: desc.enumerable ?? true,
                                configurable: true
                            });
                        }
                    } catch {
                        /* skip if getter throws */
                    }
                }
            }
        } catch {
            /* skip sealed/frozen objects */
        }
    }
    return mod;
};
