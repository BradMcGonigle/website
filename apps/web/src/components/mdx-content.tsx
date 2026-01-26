"use client";

import * as runtime from "react/jsx-runtime";
import { useMemo, createElement, type ComponentType } from "react";

interface MDXContentProps {
  code: string;
}

function getMDXComponent(code: string): ComponentType {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function(code);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return fn({ ...runtime }).default as ComponentType;
}

export function MDXContent({ code }: MDXContentProps) {
  const element = useMemo(() => {
    const Component = getMDXComponent(code);
    return createElement(Component);
  }, [code]);

  return element;
}
