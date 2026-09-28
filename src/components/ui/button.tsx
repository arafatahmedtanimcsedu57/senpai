import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/utils'

// shadcn/ui button, tuned to the Senpai design system: 44px touch targets by default,
// radius-md corners, and the "secondary" look from the season cards (pink text on navy).
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/85',
        secondary: 'bg-secondary text-primary hover:bg-secondary/70',
        outline: 'border-border bg-transparent text-foreground hover:bg-accent',
        ghost: 'text-foreground hover:bg-accent',
      },
      size: {
        default: 'h-11 px-4',
        sm: 'h-9 px-4',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /** Render the child element (e.g. a router Link) with button styles. */
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
