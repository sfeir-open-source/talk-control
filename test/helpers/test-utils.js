import { vi } from 'vitest';

/**
 * Espionne toutes les méthodes d'un objet en conservant l'implémentation (≈ sinon.spy(obj)).
 * @param obj
 */
export function spyOnAll(obj) {
    let proto = obj;
    while (proto && proto !== Object.prototype) {
        for (const key of Object.getOwnPropertyNames(proto)) {
            if (key !== 'constructor' && typeof obj[key] === 'function') vi.spyOn(obj, key);
        }
        proto = Object.getPrototypeOf(proto);
    }
    return obj;
}

/**
 * Instance dont toutes les méthodes sont des vi.fn() (≈ sinon.createStubInstance(Class)).
 * @param Cls
 */
export function createStubInstance(Cls) {
    const inst = Object.create(Cls.prototype);
    for (const key of Object.getOwnPropertyNames(Cls.prototype)) {
        if (key !== 'constructor' && typeof Cls.prototype[key] === 'function') inst[key] = vi.fn();
    }
    return inst;
}
