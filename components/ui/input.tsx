import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, isLoading, ...props }, ref) => {
    return (
      <div
        className={cn("relative flex w-full justify-center", wrapperClassName)}
      >
        <input
          className={cn(
            "flex h-10 w-full appearance-none rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
            className
          )}
          ref={ref}
          disabled={props.disabled || isLoading}
          {...props}
        />
        {isLoading && (
          <Loader2 className="absolute top-4 ml-20  h-6 w-6 animate-spin text-slate-600" />
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
