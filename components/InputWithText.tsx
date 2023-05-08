import { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface InputWithTextProps {
  label?: string;
  placeholder: string;
  text?: string;
  value?: string;
  onChange?: Dispatch<SetStateAction<string>>;
}

export function InputWithText({
  label,
  placeholder,
  text,
  value,
  onChange,
}: InputWithTextProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={label}>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        id={label}
        placeholder={placeholder}
      />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
