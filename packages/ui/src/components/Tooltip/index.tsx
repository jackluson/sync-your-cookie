import { Tooltip as STooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TooltipProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
}

const Tooltip = (props: TooltipProps) => {
  const { children, title } = props;
  return (
    <TooltipProvider>
      <STooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </STooltip>
    </TooltipProvider>
  );
};

export default Tooltip;
