import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../../button";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../../navigation-menu";
import { images } from "@/shared/assets";
import { Link, NavLink } from "react-router-dom";
import {
  BellIcon,
  CalendarDaysIcon,
  FolderIcon,
  MailIcon,
  VideoIcon,
} from "lucide-react";
import AvatarProfile from "@/shared/settings/AvatarProfile";
import { Avatar, AvatarFallback } from "../../avatar";
import { Badge } from "../../badge";

// Hamburger icon component
const HamburgerIcon = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

// Types
export interface Navbar01NavLink {
  href: string;
  label: string;
  active?: boolean;
  icon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
}

export interface Navbar01Props extends React.HTMLAttributes<HTMLElement> {
  logoHref?: string;
  navigationLinks?: Navbar01NavLink[];
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}

// Default navigation links
const defaultNavigationLinks: Navbar01NavLink[] = [
  { href: "/app", label: "File", icon: FolderIcon },
  { href: "/app/meeting", label: "Meeting", icon: VideoIcon },
  { href: "/app/gmail", label: "Gmail", icon: MailIcon },
  { href: "/app/calendar", label: "Calendar", icon: CalendarDaysIcon },
];

export const Navbar = React.forwardRef<HTMLElement, Navbar01Props>(
  (
    {
      className,
      logoHref = "/",
      navigationLinks = defaultNavigationLinks,
      signInText = "Sign In",
      signInHref = "/signin",
      ctaText = "Get Started",
      ctaHref = "/get-started",
      onSignInClick,
      onCtaClick,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 992); // 992px is lg breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    return (
      <header
        ref={combinedRef}
        className={cn(
          "fixed top-0 z-50 w-full border-b bg-skyblue-500 backdrop-blur px-4 md:px-6 ",
          className
        )}
        {...props}
      >
        <div className="max-2xl:container mx-auto flex h-[72px]  items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-10 w-10 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-48 p-2">
                  <NavigationMenu className="max-w-none w-full block">
                    <NavigationMenuList className="flex-col items-start gap-1 w-full">
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <Link
                            to={link.href}
                            className={cn(
                              "block text-center w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer no-underline",
                              link.active
                                ? "bg-accent text-accent-foreground"
                                : "text-foreground/80"
                            )}
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuItem>
                      ))}
                      <NavigationMenuItem className="w-full">
                        <Link
                          to={"/logout"}
                          className={cn(
                            "block text-center text-foreground/80 w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer no-underline"
                          )}
                        >
                          Logout
                        </Link>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav */}
            <div className="flex items-center gap-6">
              <Link
                to={logoHref}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <img src={images.logo} alt="Logo" className="w-24 h-24 p-1" />
              </Link>
              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex">
                  <NavigationMenuList className="gap-3">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        <NavLink
                          to={link.href}
                          className={({ isActive }) =>
                            `group inline-flex h-10 w-max items-center justify-center
                             rounded-3xl px-5 py-3 font-medium transition-colors
                                no-underline ${
                                  isActive
                                    ? "bg-primary-heading-text-color text-secondary-text-color "
                                    : "text-primary-heading-text-color hover:bg-primary-heading-text-color hover:text-secondary-text-color border-primary-heading-text-color border"
                                }`
                          }
                        >
                          {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                          <span>{link.label}</span>
                        </NavLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="max-sm:hidden block">
              {" "}
              <AvatarProfile />
            </div>
            <div className="relative ">
              <Avatar>
                <AvatarFallback>
                  <BellIcon className="text-sky-950 w-[18px] h-[18px] bg-skyblue-50 " />
                </AvatarFallback>
              </Avatar>
              <Badge className="absolute bg-red-500 top-1.5 left-[17px] h-1.5 w-1.5 p-0 rounded-full"></Badge>
            </div>
            <div>
              <Link
                to={"/chat"}
                className="flex items-center gap-2 px-4.5 py-2.5 bg-sky-50 rounded-full hover:bg-white"
              >
                <img src={images.chatAi} alt="Chat AI" className="w-6 h-6 " />
                <span className="text-primary-heading-text-color font-medium">
                  Chat
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

export { HamburgerIcon };
