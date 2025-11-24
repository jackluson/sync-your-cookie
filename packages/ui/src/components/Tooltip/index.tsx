import { Tooltip as STooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TooltipProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  align?: 'start' | 'center' | 'end' | undefined;
  alignOffset?: number;
}

const Tooltip = (props: TooltipProps) => {
  const { children, title, alignOffset, align } = props;
  return (
    <TooltipProvider>
      <STooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent alignOffset={alignOffset} align={align}>
          <p>{title}</p>
        </TooltipContent>
      </STooltip>
    </TooltipProvider>
  );
};

export default Tooltip;
