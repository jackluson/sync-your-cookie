import { Label, Switch } from '@sync-your-cookie/ui';

export function AutoSwitch() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Auto</Label>
    </div>
  );
}
