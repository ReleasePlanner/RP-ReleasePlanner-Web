import "@testing-library/jest-dom/vitest";
import { beforeAll, afterAll, afterEach, vi } from "vitest";
import { server } from "./server";
import * as React from "react";

// Mock MUI icons to avoid opening hundreds of files on Windows (EMFILE errors)
vi.mock("@mui/icons-material", () => {
  const Stub: React.FC<React.SVGProps<SVGSVGElement>> = (
    props: React.SVGProps<SVGSVGElement>
  ) =>
    React.createElement("svg", {
      "data-testid": "mui-icon",
      width: 24,
      height: 24,
      ...props,
    });
  interface IconModule {
    [key: string]: React.FC<React.SVGProps<SVGSVGElement>>;
    default: React.FC<React.SVGProps<SVGSVGElement>>;
  }
  const base: IconModule = { default: Stub };
  const proxy = new Proxy(base, {
    get(target, prop: string) {
      return target[prop] ?? Stub;
    },
  });
  return proxy as IconModule;
});

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());

// Polyfill global React for act
global.React = React;

// jsdom polyfills
// Element.scrollTo is not implemented in jsdom; provide a no-op mock
// that updates scrollLeft when a left value is passed.
// This prevents errors in components that call el.scrollTo.
type Scrollable = { scrollTo?: (opts: number | { left?: number }) => void };
if (!(HTMLElement.prototype as unknown as Scrollable).scrollTo) {
  Object.defineProperty(HTMLElement.prototype, "scrollTo", {
    value: function (options: number | { left?: number }) {
      try {
        // rudimentary left support for code relying on scrollLeft
        (this as unknown as { scrollLeft: number }).scrollLeft =
          typeof options === "number" ? options : options?.left ?? 0;
      } catch {
        // noop
      }
    },
    writable: true,
  });
}

// Re-export render from test-utils
export { render, screen, waitFor } from "./test-utils";
