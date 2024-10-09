import { Label, Switch } from '@sync-your-cookie/ui';

interface AutoSwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  id: string;
}
export function AutoSwitch(props: AutoSwitchProps) {
  const { value, onChange, id } = props;
  return (
    <div className="flex items-center space-x-2">
      <Switch onCheckedChange={onChange} checked={value} id={id} />
      <Label htmlFor={id}>Auto</Label>
    </div>
  );
}
