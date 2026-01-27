import * as runtime from "react/jsx-runtime";
import type { ComponentPropsWithoutRef, ComponentType } from "react";

// Only override anchor to add external link handling
// Let @tailwindcss/typography handle all other styling
function Anchor({ href, children, ...props }: ComponentPropsWithoutRef<"a">) {
  const isExternal = href?.startsWith("http");
  return (
    <a
      href={href}
      {...(isExternal && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      {...props}
    >
      {children}
      {isExternal && (
        <span className="sr-only"> (opens in new tab)</span>
      )}
    </a>
  );
}

const sharedComponents = {
  a: Anchor,
};

// Velite compiles MDX to function body strings that must be evaluated at runtime.
// This is the recommended pattern from Velite documentation.
function useMDXComponent(code: string) {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function(code);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  return fn({ ...runtime }).default;
}

interface MDXContentProps {
  code: string;
  components?: Record<string, ComponentType>;
}

export function MDXContent({ code, components }: MDXContentProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const Component = useMDXComponent(code);
  return <Component components={{ ...sharedComponents, ...components }} />;
}

export const mdxComponents = sharedComponents;

export { Anchor };
