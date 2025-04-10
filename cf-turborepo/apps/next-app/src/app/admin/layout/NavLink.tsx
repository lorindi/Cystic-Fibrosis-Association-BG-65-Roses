import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/AuthContext";
import { NavItem } from "./constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavLinkProps {
  item: NavItem;
}

export function NavLink({ item }: NavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const isActive = pathname === item.href;

  const handleClick = () => {
    if (item.href === "/logout") {
      logout();
      router.push("/");
      return;
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            isActive && "bg-slate-100",
            item.variant === "danger" && "text-red-500"
          )}
          asChild={item.href !== "/logout"}
          onClick={item.href === "/logout" ? handleClick : undefined}
        >
          {item.href === "/logout" ? (
            <div className="flex items-center">
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </div>
          ) : (
            <Link href={item.href}>
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{item.label}</p>
      </TooltipContent>
    </Tooltip>
  );
} 