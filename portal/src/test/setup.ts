import '@testing-library/jest-dom/vitest';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './server';

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());

// jsdom polyfills
// Element.scrollTo is not implemented in jsdom; provide a no-op mock
// that updates scrollLeft when a left value is passed.
// This prevents errors in components that call el.scrollTo.
if (!(HTMLElement.prototype as any).scrollTo) {
	Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
		value: function (options: any) {
			try {
				// rudimentary left support for code relying on scrollLeft
				(this as any).scrollLeft = typeof options === 'number' ? options : (options?.left ?? 0);
			} catch (_) {
				// noop
			}
		},
		writable: true,
	});
}


