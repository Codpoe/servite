import { ReactNode } from 'react';
import { ArrowRightIcon } from 'shadcn-react/icons';
import { Button } from 'shadcn-react';
import cn from 'classnames';
import { Link } from 'servite/runtime/router';

export interface BentoGridProps {
  children?: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[22rem] grid-cols-3 gap-4',
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface BentoCardProps {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  to?: string;
  cta?: string;
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  to,
  cta,
}: BentoCardProps) {
  return (
    <div
      key={name}
      className={cn(
        'group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl',
        // light styles
        'bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        // dark styles
        'transform-gpu dark:border dark:border-border dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
        className,
      )}
    >
      <div>{background}</div>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
        <Icon className="h-12 w-12 origin-left transform-gpu text-foreground transition-all duration-300 ease-in-out group-hover:scale-75" />
        <h3 className="text-xl font-semibold text-foreground dark:text-neutral-300">
          {name}
        </h3>
        <p className="max-w-lg text-foreground/50">{description}</p>
      </div>

      {to && cta && (
        <div
          className={cn(
            'pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100',
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            className="pointer-events-auto whitespace-nowrap !-ml-1.5"
          >
            <Link to={to}>
              {cta}
              <ArrowRightIcon
                width={16}
                height={16}
                className="ml-2 inline-block"
              />
            </Link>
          </Button>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    </div>
  );
}