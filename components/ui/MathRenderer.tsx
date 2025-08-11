import React from 'react';
import { MathJax } from 'better-react-mathjax';

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

/**
 * A component to render a string containing HTML and LaTeX.
 * It uses `dangerouslySetInnerHTML` to render the HTML structure
 * and wraps it with the `MathJax` component to ensure LaTeX is typeset correctly.
 */
const MathRenderer: React.FC<MathRendererProps> = ({ content, className, inline = false }) => {
  // Use 'span' for inline elements and 'div' for block elements to ensure semantic HTML.
  const Wrapper = inline ? 'span' : 'div';
  
  return (
    <Wrapper className={className}>
      {/*
        The key is essential here. By changing the key whenever the content changes,
        we force React to unmount the old MathJax component and mount a new one.
        This ensures that `better-react-mathjax` re-runs its typesetting logic
        on a fresh DOM tree, avoiding issues with stale content.
      */}
      <MathJax key={content} hideUntilTypeset="first" inline={inline}>
        <Wrapper dangerouslySetInnerHTML={{ __html: content }} />
      </MathJax>
    </Wrapper>
  );
};

export default MathRenderer;