"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/wishlist", label: "Wishlist Saya", icon: Target },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-sky-200 border-b border-border/50">
      {/* Gunakan Grid 3 Kolom: Kiri (1fr), Tengah (auto), Kanan (1fr) */}
      <div className="w-full h-20 px-6 md:px-10 grid grid-cols-3 items-center">
        
        {/* Kolom Kiri: Logo */}
        <div className="flex justify-start">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-4xl font-bold text-white tracking-tight hidden sm:block">
              Wishly
            </span>
          </Link>
        </div>

        {/* Kolom Tengah: Navigation Menu */}
        <div className="flex justify-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navItems.map((item) => {
                const isActive = item.href === "/" 
                  ? pathname === "/" 
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <NavigationMenuItem key={item.href}>
                    <Link 
                      href={item.href} 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "gap-2 rounded-full px-5 py-2.5 text-base font-medium transition-colors",
                        isActive
                          ? "bg-white text-black hover:bg-primary/15"
                          : "text-black hover:bg-sky-100 hover:text-foreground"
                      )}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}