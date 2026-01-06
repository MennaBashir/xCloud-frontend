import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HourPickerProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

const HourPicker = ({ value, onChange, disabled = false }: HourPickerProps) => {
	return (
		<div className='flex flex-row justify-between px-2 pb-2 gap-3'>
			<Label htmlFor='time-picker' className='px-1 text-skyblue-500 font-bold'>
				Time
			</Label>
			<Input
				disabled={disabled}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				type='time'
				id='time-picker'
				className='w-fit bg-[#EDEEF2] border-none focus-visible:ring-skyblue-500 font-medium text-slate-700 '
			/>
		</div>
	);
};

export default HourPicker;
