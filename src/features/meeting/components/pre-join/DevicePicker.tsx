import { type ComponentType, type SVGProps } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { DeviceInfo } from "../../hooks/useMediaDevices";

type DevicePickerProps = {
	label: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	devices: DeviceInfo[];
	selectedId: string | undefined;
	onSelect: (id: string) => void;
	disabled?: boolean;
};

export function DevicePicker({
	label,
	icon: Icon,
	devices,
	selectedId,
	onSelect,
	disabled,
}: DevicePickerProps) {
	const selected =
		devices.find((d) => d.deviceId === selectedId) ?? devices[0];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				disabled={disabled || devices.length === 0}
				className={cn(
					"inline-flex items-center gap-2 min-w-0",
					"h-9 ps-3 pe-2 rounded-full",
					"bg-white/8 border border-white/12 text-white",
					"text-[0.8125rem]",
					"transition-[background-color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
					"hover:bg-white/14 disabled:opacity-50 disabled:cursor-not-allowed",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				)}
			>
				<Icon className="size-3.5 shrink-0" strokeWidth={1.6} />
				<span className="truncate max-w-[12rem]">
					{selected?.label ?? label}
				</span>
				<ChevronDown className="size-3 opacity-70" strokeWidth={1.8} />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				className="min-w-[14rem] max-w-[20rem] rounded-[var(--radius-lg)]"
			>
				<DropdownMenuLabel className="text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
					{label}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{devices.map((d) => (
					<DropdownMenuItem
						key={d.deviceId}
						onSelect={() => onSelect(d.deviceId)}
						className="cursor-pointer"
					>
						<span className="truncate">{d.label}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
