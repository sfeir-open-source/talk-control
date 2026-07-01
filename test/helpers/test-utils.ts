import { vi } from 'vitest';

/**
 * Espionne toutes les méthodes d'un objet en conservant l'implémentation (≈ sinon.spy(obj)).
 * @param obj
 */
export function spyOnAll<T extends object>(obj: T): T {
    let proto: object | null = obj;
    while (proto && proto !== Object.prototype) {
        for (const key of Object.getOwnPropertyNames(proto)) {
            if (key !== 'constructor' && typeof (obj as Record<string, unknown>)[key] === 'function') {
                vi.spyOn(obj as any, key);
            }
        }
        proto = Object.getPrototypeOf(proto);
    }
    return obj;
}

/**
 * Instance dont toutes les méthodes sont des vi.fn() (≈ sinon.createStubInstance(Class)).
 * @param Cls
 */
export function createStubInstance<T>(Cls: new (...args: unknown[]) => T): T {
    const inst = Object.create(Cls.prototype);
    for (const key of Object.getOwnPropertyNames(Cls.prototype)) {
        if (key !== 'constructor' && typeof Cls.prototype[key] === 'function') {
            inst[key] = vi.fn();
        }
    }
    return inst;
}
