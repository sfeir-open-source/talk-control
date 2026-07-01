import { vi } from 'vitest';

// EventBusResolver imports socket.io server-side code (not browser-compatible).
// Mock the resolver so TC components can be instantiated in browser tests.
vi.mock('@event-bus/event-bus-resolver', () => ({
    EventBusResolver: {
        channel: vi.fn().mockReturnValue({
            on: vi.fn(),
            broadcast: vi.fn(),
            emitTo: vi.fn()
        }),
        init: vi.fn()
    },
    Channels: {
        CONTROLLER_SERVER: 'CONTROLLER_SERVER',
        CONTROLLER_COMPONENT: 'CONTROLLER_COMPONENT'
    }
}));

vi.mock('@services/context', () => ({
    default: { isUsingRemoteUrl: vi.fn(() => false) }
}));
