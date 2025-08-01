import { cn } from '@/lib/utils';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string;
}

export function Table({ className, wrapperClassName, ...props }: TableProps) {
  return (
    <div className={cn('my-6 w-full overflow-x-auto', wrapperClassName)}>
      <table
        className={cn(
          'w-full border-collapse text-left text-sm',
          'text-gray-700 dark:text-gray-300',
          className
        )}
        {...props}
      />
    </div>
  );
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn(
        'bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400',
        className
      )}
      {...props}
    />
  );
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={cn('divide-y divide-gray-200 dark:divide-gray-700', className)} {...props} />;
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  hover?: boolean;
}

export function TableRow({ className, hover = true, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        'border-b border-gray-200 transition-colors dark:border-gray-700',
        hover && 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        className
      )}
      {...props}
    />
  );
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider',
        'text-gray-500 dark:text-gray-400',
        className
      )}
      {...props}
    />
  );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export function TableCell({ className, ...props }: TableCellProps) {
  return <td className={cn('px-4 py-3', className)} {...props} />;
}

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

export function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      className={cn('mt-2 text-sm text-gray-500 dark:text-gray-400', className)}
      {...props}
    />
  );
}

// Compound component for easier imports
export const DataTable = {
  Table,
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
};
