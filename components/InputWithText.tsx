import { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface InputWithTextProps {
  label?: string | number;
  placeholder: string;
  text?: string;
  value?: string | number;
  onChange?: Dispatch<SetStateAction<any>>;
  disabled?: boolean;
}

export function InputWithText({
  label,
  placeholder,
  text,
  value,
  onChange,
  disabled,
}: InputWithTextProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label className="mb-1" htmlFor={String(label)}>
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        id={String(label)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
