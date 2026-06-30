import { vi } from 'vitest';

// EventBusResolver imports socket.io server-side code (not browser-compatible).
// Mock the resolver so TC components can be instantiated in browser tests.
vi.mock('@event-bus/event-bus-resolver', () => ({
    EventBusResolver: {
        channel: vi.fn().mockReturnValue({
            on: vi.fn(),
            emit: vi.fn()
        }),
        init: vi.fn()
    },
    Channels: {
        CONTROLLER_COMPONENT: 'CONTROLLER_COMPONENT',
        CONTROLLER_SERVER: 'CONTROLLER_SERVER',
        COMPONENT_CONTROLLER: 'COMPONENT_CONTROLLER'
    }
}));
