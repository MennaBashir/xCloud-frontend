import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronUp, Home, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { LanguagePill } from "@/shared/components/LanguagePill";
import {
	selectUser,
	useAuthStore,
} from "@/features/auth/store/authStore";

function initials(name: string) {
	return name
		.split(" ")
		.map((w) => w[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

type UserMenuProps = {
	className?: string;
	/** Icon-only rendering for a collapsed sidebar rail. */
	collapsed?: boolean;
};

export function UserMenu({ className, collapsed = false }: UserMenuProps) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const user = useAuthStore(selectUser);
	const logout = useAuthStore((s) => s.logout);

	if (!user) return null;

	const handleLogout = () => {
		logout();
		navigate("/", { replace: true });
	};

	const handleBackToLanding = () => {
		navigate("/");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label={collapsed ? user.name : undefined}
				title={collapsed ? user.name : undefined}
				className={cn(
					"group/usermenu inline-flex items-center w-full",
					"rounded-[var(--radius-md)]",
					"text-start",
					collapsed ? "justify-center px-1 py-2" : "gap-3 px-2 py-2",
					"hover:bg-sidebar-accent transition-colors duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
					className,
				)}
			>
				<Avatar className="size-8 shrink-0">
					<AvatarImage src={user.avatarUrl} alt="" />
					<AvatarFallback className="bg-surface-muted text-foreground text-[0.75rem] font-medium">
						{initials(user.name)}
					</AvatarFallback>
				</Avatar>
				{!collapsed ? (
					<>
						<div className="flex flex-col min-w-0 flex-1">
							<span className="text-[0.8125rem] font-medium text-foreground truncate">
								{user.name}
							</span>
							<span className="text-[0.6875rem] text-muted-foreground truncate">
								{user.email}
							</span>
						</div>
						<ChevronUp
							className="size-3.5 text-muted-foreground shrink-0"
							strokeWidth={1.6}
						/>
					</>
				) : null}
			</DropdownMenuTrigger>

			<DropdownMenuContent
				side="top"
				align="start"
				sideOffset={8}
				className="min-w-[15rem] rounded-[var(--radius-lg)] border-border bg-popover"
			>
				<DropdownMenuLabel className="flex flex-col gap-0.5">
					<span className="text-[0.8125rem] font-medium text-foreground truncate">
						{user.name}
					</span>
					<span className="text-[0.6875rem] text-muted-foreground truncate">
						{user.email}
					</span>
					{user.role ? (
						<span className="mt-1 text-[0.6875rem] text-muted-foreground uppercase tracking-[0.14em]">
							{user.role}
						</span>
					) : null}
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<div className="px-2 py-1.5 flex items-center justify-between gap-2">
					<span className="text-[0.75rem] text-muted-foreground">
						{t("theme.label")}
					</span>
					<ThemeToggle />
				</div>

				<div className="px-2 py-1.5 flex items-center justify-between gap-2">
					<span className="text-[0.75rem] text-muted-foreground">
						{t("language.label")}
					</span>
					<LanguagePill />
				</div>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					className="cursor-pointer gap-2 text-foreground"
					onSelect={handleBackToLanding}
				>
					<Home className="size-3.5" strokeWidth={1.6} />
					<span className="text-[0.8125rem]">
						{t("actions.goToLanding", {
							defaultValue: "Back to landing",
						})}
					</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					className="cursor-pointer gap-2 text-foreground"
					onSelect={handleLogout}
				>
					<LogOut className="size-3.5" strokeWidth={1.6} />
					<span className="text-[0.8125rem]">{t("actions.signOut")}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
