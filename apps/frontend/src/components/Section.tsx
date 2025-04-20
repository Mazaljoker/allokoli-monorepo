import React from 'react';

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
};

/**
 * Reusable Section component that provides consistent vertical padding
 * and container wrapping for content sections.
 */
const Section: React.FC<SectionProps> = ({ children, className = '', fullWidth = false }) => {
  return (
    <section className={`py-24 ${className}`}>
      <div className={`${fullWidth ? 'w-full' : 'container'}`}>
        {children}
      </div>
    </section>
  );
};

export default Section;