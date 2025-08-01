import { cn } from '@/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const tabsListVariants = cva(
  'inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
  {
    variants: {
      variant: {
        default: 'h-10',
        outline: 'h-10 space-x-2',
        pills: 'h-auto p-0 bg-transparent gap-1',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        outline:
          'border border-input bg-transparent data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow',
        pills:
          'rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-accent hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants> & {
      icon?: React.ReactNode;
    }
>(({ className, variant, icon, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'group relative inline-flex items-center gap-2',
      tabsTriggerVariants({ variant, className })
    )}
    {...props}
  >
    {icon && <span className="text-base">{icon}</span>}
    {children}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Helper component for tab group with automatic state management
interface TabsGroupProps {
  defaultValue: string;
  items: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }>;
  variant?: 'default' | 'outline' | 'pills';
  className?: string;
  contentClassName?: string;
}

const TabsGroup = ({
  defaultValue,
  items,
  variant = 'default',
  className,
  contentClassName,
}: TabsGroupProps) => {
  return (
    <Tabs defaultValue={defaultValue} className={cn('w-full', className)}>
      <TabsList variant={variant} className="mb-4">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            variant={variant}
            icon={item.icon}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value} className={contentClassName}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsGroup };
