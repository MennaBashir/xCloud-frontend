import { cn } from "@/lib/utils";

import { ParticipantTile } from "./ParticipantTile";

type ParticipantGridProps = {
	participantIds: string[];
	activeSpeakerId: string | null;
	className?: string;
};

/**
 * Responsive grid that picks a column count based on participant count.
 * Mobile collapses to 1-2 columns, desktop supports up to 4 across.
 */
function gridColsClass(count: number): string {
	if (count <= 1) return "grid-cols-1";
	if (count <= 2) return "grid-cols-1 sm:grid-cols-2";
	if (count <= 4) return "grid-cols-2";
	if (count <= 6) return "grid-cols-2 lg:grid-cols-3";
	return "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
}

export function ParticipantGrid({
	participantIds,
	activeSpeakerId,
	className,
}: ParticipantGridProps) {
	return (
		<div
			className={cn(
				"grid gap-3 sm:gap-4 auto-rows-fr w-full",
				gridColsClass(participantIds.length),
				className,
			)}
		>
			{participantIds.map((id) => (
				<ParticipantTile
					key={id}
					participantId={id}
					isSpeaker={id === activeSpeakerId}
				/>
			))}
		</div>
	);
}
