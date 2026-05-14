import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { HexColorPicker } from "react-colorful";

import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
	value: string;
	onChange: (value: string) => void;
}

/**
 * Preset swatches tuned to the design system (OKLCH for token parity).
 * Custom hex picker remains available below.
 */
const PRESETS: Array<{ label: string; value: string }> = [
	{ label: "Blue", value: "oklch(0.62 0.19 245)" },
	{ label: "Violet", value: "oklch(0.55 0.2 285)" },
	{ label: "Emerald", value: "oklch(0.65 0.16 162)" },
	{ label: "Amber", value: "oklch(0.78 0.16 75)" },
	{ label: "Rose", value: "oklch(0.62 0.21 27)" },
	{ label: "Slate", value: "oklch(0.5 0.02 250)" },
];

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const isHex = /^#[0-9A-Fa-f]{3,8}$/.test(value);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"inline-flex items-center gap-2.5 w-full px-3.5 h-10",
						"rounded-[var(--radius-md)] border border-border bg-surface-elevated",
						"text-[0.875rem] text-foreground",
						"hover:border-border-strong transition-colors duration-[var(--duration-fast)]",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
					)}
				>
					<span
						aria-hidden="true"
						className="size-4 rounded-full border border-border shrink-0"
						style={{ backgroundColor: value }}
					/>
					<span className="flex-1 text-start truncate">
						{value || "Pick a color"}
					</span>
					<ChevronDown
						className="size-3.5 text-muted-foreground"
						strokeWidth={1.6}
					/>
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-[260px] p-3">
				<div className="grid grid-cols-6 gap-2 mb-3">
					{PRESETS.map((p) => {
						const active = value === p.value;
						return (
							<button
								key={p.value}
								type="button"
								onClick={() => onChange(p.value)}
								aria-label={p.label}
								className={cn(
									"relative grid place-items-center size-8 rounded-full",
									"transition-transform duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
									"hover:scale-110 active:scale-[0.96]",
									active && "ring-2 ring-offset-2 ring-offset-popover ring-foreground",
								)}
								style={{ backgroundColor: p.value }}
							>
								{active ? (
									<Check
										className="size-3.5 text-white drop-shadow"
										strokeWidth={2.4}
									/>
								) : null}
							</button>
						);
					})}
				</div>

				<HexColorPicker
					color={isHex ? value : "#3b82f6"}
					onChange={onChange}
					style={{ width: "100%", height: 140 }}
				/>

				<div className="mt-3 flex items-center gap-2">
					<span className="text-[0.6875rem] font-mono text-muted-foreground">
						#
					</span>
					<Input
						value={isHex ? value.replace("#", "") : ""}
						placeholder="hex"
						onChange={(e) => onChange(`#${e.target.value}`)}
						maxLength={6}
						className="h-8 font-mono text-[0.8125rem]"
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
