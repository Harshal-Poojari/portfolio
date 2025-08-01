import { cn } from '@/lib/utils';
import { AlertTriangle, Info, Lightbulb, AlertCircle, CheckCircle2 } from 'lucide-react';

const variantStyles = {
  note: {
    icon: Info,
    container: 'bg-blue-50 dark:bg-blue-900/20',
    title: 'text-blue-700 dark:text-blue-300',
    text: 'text-blue-700/90 dark:text-blue-300/90',
    border: 'border-blue-200 dark:border-blue-800',
  },
  tip: {
    icon: Lightbulb,
    container: 'bg-emerald-50 dark:bg-emerald-900/20',
    title: 'text-emerald-700 dark:text-emerald-300',
    text: 'text-emerald-700/90 dark:text-emerald-300/90',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  warning: {
    icon: AlertTriangle,
    container: 'bg-amber-50 dark:bg-amber-900/20',
    title: 'text-amber-700 dark:text-amber-300',
    text: 'text-amber-700/90 dark:text-amber-300/90',
    border: 'border-amber-200 dark:border-amber-800',
  },
  danger: {
    icon: AlertCircle,
    container: 'bg-red-50 dark:bg-red-900/20',
    title: 'text-red-700 dark:text-red-300',
    text: 'text-red-700/90 dark:text-red-300/90',
    border: 'border-red-200 dark:border-red-800',
  },
  success: {
    icon: CheckCircle2,
    container: 'bg-green-50 dark:bg-green-900/20',
    title: 'text-green-700 dark:text-green-300',
    text: 'text-green-700/90 dark:text-green-300/90',
    border: 'border-green-200 dark:border-green-800',
  },
} as const;

type Variant = keyof typeof variantStyles;

interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  title?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function Callout({
  variant = 'note',
  title,
  className,
  children,
  icon: Icon,
  ...props
}: CalloutProps) {
  const variantStyle = variantStyles[variant];
  const IconComponent = Icon || variantStyle.icon;
  
  return (
    <div
      className={cn(
        'my-6 overflow-hidden rounded-lg border border-l-4 p-4',
        variantStyle.container,
        variantStyle.border,
        className
      )}
      {...props}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <IconComponent
            className={cn('h-5 w-5', variantStyle.title)}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={cn('mt-0 text-sm font-medium', variantStyle.title)}>
              {title}
            </h3>
          )}
          <div className={cn('mt-1 text-sm', variantStyle.text)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export individual callout components for convenience
export function Note({ className, ...props }: Omit<CalloutProps, 'variant'>) {
  return <Callout variant="note" className={className} {...props} />;
}

export function Tip({ className, ...props }: Omit<CalloutProps, 'variant'>) {
  return <Callout variant="tip" className={className} {...props} />;
}

export function Warning({ className, ...props }: Omit<CalloutProps, 'variant'>) {
  return <Callout variant="warning" className={className} {...props} />;
}

export function Danger({ className, ...props }: Omit<CalloutProps, 'variant'>) {
  return <Callout variant="danger" className={className} {...props} />;
}

export function Success({ className, ...props }: Omit<CalloutProps, 'variant'>) {
  return <Callout variant="success" className={className} {...props} />;
}
