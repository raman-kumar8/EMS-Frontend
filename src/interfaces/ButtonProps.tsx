import type { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

export default interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}