import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
	value: string;
	onChange: (value: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					className='cursor-pointer w-full justify-start text-left ring-1 ring-transparent focus-visible:ring-skyblue-500 focus-visible:ring-2 border-none bg-[#EDEEF2] hover:bg-[#EDEEF2] py-2 rounded-lg font-medium'>
					<div className='w-full flex items-center gap-2'>
						<div
							className='h-4 w-4 rounded-full border border-slate-200'
							style={{ backgroundColor: value }}
						/>
						<div className='truncate flex-1'>
							{value ? value : "Pick a color"}
						</div>
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-64'>
				<HexColorPicker color={value} onChange={onChange} />

				<div className='mt-4 flex items-center gap-2'>
					<span className='text-sm text-slate-500'>#</span>
					<Input
						id='custom-hex'
						value={value.replace("#", "")}
						onChange={(e) => onChange(`#${e.target.value}`)}
						maxLength={6}
						className='h-8'
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
