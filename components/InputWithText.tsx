import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface InputWithTextProps {
  label: string;
  placeholder: string;
  text?: string;
}

export function InputWithText({
  label,
  placeholder,
  text,
}: InputWithTextProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={label}>{label}</Label>
      <Input type="text" id={label} placeholder={placeholder} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
