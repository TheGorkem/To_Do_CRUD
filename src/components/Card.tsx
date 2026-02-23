import type React from "react";
import { cn } from "@/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = ({ className, ...props }: CardProps) => (
  <div className={cn("glass rounded-2xl p-5", className)} {...props} />
);

export default Card;
