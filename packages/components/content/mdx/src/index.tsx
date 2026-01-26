import * as runtime from "react/jsx-runtime";
import type { ComponentPropsWithoutRef, ComponentType } from "react";

function Pre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      className="overflow-x-auto rounded-lg bg-muted p-4 text-sm"
      {...props}
    >
      {children}
    </pre>
  );
}

function Code({ children, ...props }: ComponentPropsWithoutRef<"code">) {
  return (
    <code className="font-mono" {...props}>
      {children}
    </code>
  );
}

function Blockquote({ children, ...props }: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className="border-l-4 border-muted-foreground/30 pl-4 italic"
      {...props}
    >
      {children}
    </blockquote>
  );
}

function Anchor({ href, children, ...props }: ComponentPropsWithoutRef<"a">) {
  const isExternal = href?.startsWith("http");
  return (
    <a
      href={href}
      className="text-primary underline underline-offset-4 hover:text-primary/80"
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    >
      {children}
    </a>
  );
}

const sharedComponents = {
  pre: Pre,
  code: Code,
  blockquote: Blockquote,
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

export { Pre, Code, Blockquote, Anchor };
