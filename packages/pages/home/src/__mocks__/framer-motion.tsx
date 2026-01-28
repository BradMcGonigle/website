import { type ReactNode, forwardRef, type Ref, type HTMLAttributes } from "react";

type MotionProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  variants?: unknown;
  whileHover?: unknown;
  whileTap?: unknown;
  whileFocus?: unknown;
  whileInView?: unknown;
};

// Create individual motion components that just render the element
const MotionDiv = forwardRef<HTMLDivElement, MotionProps>(
  (
    {
      children,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      variants: _v,
      whileHover: _wh,
      whileTap: _wt,
      whileFocus: _wf,
      whileInView: _wiv,
      ...props
    },
    ref
  ) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
);
MotionDiv.displayName = "MotionDiv";

const MotionSpan = forwardRef<HTMLSpanElement, MotionProps>(
  (
    {
      children,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      variants: _v,
      whileHover: _wh,
      whileTap: _wt,
      whileFocus: _wf,
      whileInView: _wiv,
      ...props
    },
    ref
  ) => (
    <span ref={ref} {...props}>
      {children}
    </span>
  )
);
MotionSpan.displayName = "MotionSpan";

const MotionH1 = forwardRef<HTMLHeadingElement, MotionProps>(
  (
    {
      children,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      variants: _v,
      whileHover: _wh,
      whileTap: _wt,
      whileFocus: _wf,
      whileInView: _wiv,
      ...props
    },
    ref
  ) => (
    <h1 ref={ref} {...props}>
      {children}
    </h1>
  )
);
MotionH1.displayName = "MotionH1";

const MotionH2 = forwardRef<HTMLHeadingElement, MotionProps>(
  (
    {
      children,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      variants: _v,
      whileHover: _wh,
      whileTap: _wt,
      whileFocus: _wf,
      whileInView: _wiv,
      ...props
    },
    ref
  ) => (
    <h2 ref={ref} {...props}>
      {children}
    </h2>
  )
);
MotionH2.displayName = "MotionH2";

const MotionH3 = forwardRef<HTMLHeadingElement, MotionProps>(
  (
    {
      children,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      variants: _v,
      whileHover: _wh,
      whileTap: _wt,
      whileFocus: _wf,
      whileInView: _wiv,
      ...props
    },
    ref
  ) => (
    <h3 ref={ref} {...props}>
      {children}
    </h3>
  )
);
MotionH3.displayName = "MotionH3";

const MotionP = forwardRef<HTMLParagraphElement, MotionProps>(
  (
    {
      children,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      variants: _v,
      whileHover: _wh,
      whileTap: _wt,
      whileFocus: _wf,
      whileInView: _wiv,
      ...props
    },
    ref
  ) => (
    <p ref={ref} {...props}>
      {children}
    </p>
  )
);
MotionP.displayName = "MotionP";

const MotionA = forwardRef<HTMLAnchorElement, MotionProps>(
  (
    {
      children,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      variants: _v,
      whileHover: _wh,
      whileTap: _wt,
      whileFocus: _wf,
      whileInView: _wiv,
      ...props
    },
    ref
  ) => (
    <a ref={ref} {...props}>
      {children}
    </a>
  )
);
MotionA.displayName = "MotionA";

// Factory function for dynamic elements
function createMotionComponent(element: "h1" | "h2" | "h3" | "p" | "span") {
  const components = {
    h1: MotionH1,
    h2: MotionH2,
    h3: MotionH3,
    p: MotionP,
    span: MotionSpan,
  };
  return components[element];
}

export const motion = {
  div: MotionDiv,
  span: MotionSpan,
  h1: MotionH1,
  h2: MotionH2,
  h3: MotionH3,
  p: MotionP,
  a: MotionA,
  create: createMotionComponent,
};

export const useInView = (_ref: Ref<unknown>, _options?: unknown) => true;

export const AnimatePresence = ({ children }: { children: ReactNode }) =>
  children;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Variants = Record<string, any>;
