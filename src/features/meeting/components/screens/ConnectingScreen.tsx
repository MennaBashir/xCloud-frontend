import { useTranslation } from "react-i18next";

export function ConnectingScreen() {
	const { t } = useTranslation("meeting");
	return (
		<div className="min-h-[100dvh] grid place-items-center bg-zinc-950 text-white">
			<div className="flex flex-col items-center gap-4">
				<div className="grid place-items-center size-12 rounded-full bg-white/8 ring-1 ring-inset ring-white/12">
					<span className="relative grid size-3 place-items-center">
						<span className="absolute inset-0 rounded-full bg-success/60 animate-ping" />
						<span className="relative size-3 rounded-full bg-success" />
					</span>
				</div>
				<p className="text-[0.9375rem] font-medium tracking-tight">
					{t("room.connecting")}
				</p>
			</div>
		</div>
	);
}
