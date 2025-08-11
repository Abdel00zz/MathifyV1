
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, containerClassName, className, ...props }, ref) => {
    const baseClasses = 'flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-blue-500 dark:focus:border-blue-500';
    
    return (
      <div className={containerClassName}>
        {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>}
        <input id={id} ref={ref} className={`${baseClasses} ${className || ''}`} {...props} />
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;