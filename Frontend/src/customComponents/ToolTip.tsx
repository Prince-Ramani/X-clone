import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

const CustomTooltip = ({
  children,
  title,
  delay,
}: {
  children: React.ReactNode;
  title: string;
  delay?: number;
}) => {
  return (
    <TooltipProvider delayDuration={delay || 500}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
