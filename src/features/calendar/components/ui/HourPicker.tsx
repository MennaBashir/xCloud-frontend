import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HourPickerProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

const HourPicker = ({ value, onChange, disabled = false }: HourPickerProps) => {
	return (
		<div className="flex items-center justify-between gap-3 px-3 py-3 border-t border-border">
			<Label
				htmlFor="time-picker"
				className="text-[0.75rem] font-medium text-muted-foreground"
			>
				Time
			</Label>
			<Input
				id="time-picker"
				type="time"
				disabled={disabled}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="h-8 w-[120px] text-[0.875rem] font-mono"
			/>
		</div>
	);
};

export default HourPicker;
