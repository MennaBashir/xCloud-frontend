import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface DeleteEventDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

const DeleteEventDialog = ({
	open,
	onOpenChange,
	onConfirm,
}: DeleteEventDialogProps) => {
	const { t } = useTranslation("calendar");
	const { t: tc } = useTranslation();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[420px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2.5 text-foreground font-semibold tracking-tight">
						<span className="grid size-8 place-items-center rounded-full bg-destructive/12 text-destructive ring-1 ring-inset ring-destructive/25">
							<AlertTriangle className="size-4" strokeWidth={1.6} />
						</span>
						{t("list.deleteConfirmTitle")}
					</DialogTitle>
					<DialogDescription className="text-[0.875rem] text-muted-foreground leading-relaxed">
						{t("list.deleteConfirmDescription")}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="gap-2">
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						{tc("actions.cancel")}
					</Button>
					<Button
						variant="destructive"
						onClick={() => {
							onOpenChange(false);
							onConfirm();
						}}
					>
						{tc("actions.delete")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteEventDialog;
