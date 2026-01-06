import {ChevronDownIcon,LogOutIcon,} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { User } from "@/shared/context/UserContext";
// import { useContext } from "react";

export default function AvatarProfile() {
    // const { auth } = useContext(User);
    

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="h-auto hover:bg-transparent bg-transparent mx-10 ">
                    <Avatar className={""}>
                        <AvatarImage src="./avatar.jpg" alt="Profile image" />
                        <AvatarFallback className={"bg-skyblue-50 text-sky-950 font-bold  "}>MB</AvatarFallback>
                    </Avatar>
                    <ChevronDownIcon
                        size={16}
                        className="opacity-60"
                        aria-hidden="true"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-64 mx-8 bg-[#fffffffc]">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
                    <span className="text-foreground truncate text-sm font-medium">
                        {/* {auth?.userName} */}
                        Menna Bashir

                    </span>
                    <span className="text-muted-foreground truncate text-xs font-normal">
                        {/* {auth?.email} */}
                        menna.bashir@example.com
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className={"cursor-pointer"}>
                    <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}