"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Package,
  Video,
  Trophy,
  Info,
  Store,
  Activity,
  Gift,
  Sparkles,
  Grid3x3,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WalletButton } from "@/components/wallet-button";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Packs", href: "/packs", icon: Package, badge: "NEW" },
  { name: "Stream", href: "/stream", icon: Video },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Admin", href: "/admin", icon: Settings },
  { name: "About", href: "/about", icon: Info },
];

const communityLinks = [
  { name: "Merchants", href: "/merchants", icon: Store, badge: "SOON" },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Refer & Earn", href: "/refer", icon: Gift },
];

const exploreLinks = [
  { name: "Pokémon", href: "/pokemon", icon: Sparkles },
  { name: "Card Sets", href: "/card-sets", icon: Grid3x3 },
];

export function Sidebar({
  onCollapseChange,
}: {
  onCollapseChange?: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-10 bottom-0 bg-background border-r border-border overflow-y-auto transition-all duration-300 z-40",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                <span className="text-foreground">phygitals</span>
              </div>
              <span className="px-2 py-0.5 text-xs bg-secondary text-muted-foreground rounded">
                BETA
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className={cn("h-8 w-8 p-0", isCollapsed && "mx-auto")}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        <nav className="space-y-6">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs bg-success/20 text-success rounded">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>

          {!isCollapsed && (
            <>
              <div>
                <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Community
                </h3>
                <div className="space-y-1">
                  {communityLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Explore
                </h3>
                <div className="space-y-1">
                  {exploreLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          {isCollapsed && (
            <div className="space-y-1">
              {[...communityLinks, ...exploreLinks].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-center px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                  title={item.name}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div
          className={cn(
            "mt-8 pt-6 border-t border-border space-y-4",
            isCollapsed && "flex flex-col items-center"
          )}
        >
          <WalletButton collapsed={isCollapsed} />

          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-muted-foreground">Dark mode</span>
              <div className="w-10 h-6 bg-secondary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-foreground rounded-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
