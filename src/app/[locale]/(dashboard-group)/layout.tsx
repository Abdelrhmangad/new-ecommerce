'use client';
import React, { useState } from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<DashboardNavbar />
			{children}
		</div>
	);
}

import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import {
	LayoutDashboard,
	ShoppingBag,
	Package,
	Users,
	BarChart3,
	Settings,
	Bell,
	Search,
	Menu,
	Sparkles,
	Store,
	CreditCard,
	LogOut,
	User,
	Plus
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';

const navigationRoutes = [
	{ name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
	{ name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag, badge: '12' },
	{ name: 'Products', href: '/dashboard/products', icon: Package },
	{ name: 'Customers', href: '/dashboard/customers', icon: Users },
	{ name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
	{ name: 'Settings', href: '/dashboard/settings', icon: Settings }
];

export function DashboardNavbar() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md transition-all">
			<div className="flex h-16 items-center justify-between px-4 md:px-6">
				{/* Left Section: Brand & Navigation */}
				<div className="flex items-center gap-6">
					{/* Mobile Menu Trigger */}
					<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
						<SheetTrigger
							render={
								<Button
									variant="ghost"
									size="icon"
									className="lg:hidden"
									aria-label="Toggle Navigation Menu"
								>
									<Menu className="h-5 w-5" />
								</Button>
							}
						></SheetTrigger>
						<SheetContent side="left" className="w-72 p-6">
							<div className="flex items-center gap-2 mb-8">
								<Link
									href="/dashboard"
									className="flex items-center justify-center gap-2 font-semibold"
								>
									<Image src="/logo.svg" className="h-10 w-auto" width="32" height="32" alt="logo" />
								</Link>
							</div>
							<nav className="flex flex-col gap-2">
								{navigationRoutes.map((route) => {
									const Icon = route.icon;
									const isActive = pathname === route.href;
									return (
										<Link
											key={route.href}
											href={route.href}
											onClick={() => setMobileMenuOpen(false)}
											className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
												isActive
													? 'bg-primary text-primary-foreground shadow-sm'
													: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
											}`}
										>
											<div className="flex items-center gap-3">
												<Icon className="h-4 w-4" />
												<span>{route.name}</span>
											</div>
											{route.badge && (
												<Badge
													variant={isActive ? 'outline' : 'secondary'}
													className="ml-auto text-xs"
												>
													{route.badge}
												</Badge>
											)}
										</Link>
									);
								})}
							</nav>
						</SheetContent>
					</Sheet>

					{/* Logo / Brand Name */}
					<Link href="/dashboard" className="flex items-center gap-2.5 transition-transform active:scale-95">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20">
							<Store className="h-5 w-5" />
						</div>
						<span className="hidden font-bold text-lg tracking-tight sm:inline-block">AuraStore</span>
					</Link>

					{/* Desktop Navigation Links */}
					<nav className="hidden lg:flex items-center gap-1">
						{navigationRoutes.map((route) => {
							const Icon = route.icon;
							const isActive = pathname === route.href;
							return (
								<Link
									key={route.href}
									href={route.href}
									className={`relative flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
										isActive
											? 'text-foreground bg-accent/60 font-semibold'
											: 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
									}`}
								>
									<Icon className="h-4 w-4" />
									<span>{route.name}</span>
									{route.badge && (
										<Badge
											variant="secondary"
											className="ml-1 px-1.5 py-0.2 text-[10px] font-semibold"
										>
											{route.badge}
										</Badge>
									)}
									{isActive && (
										<span className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full" />
									)}
								</Link>
							);
						})}
					</nav>
				</div>

				{/* Right Section: Search & Actions */}
				<div className="flex items-center gap-2 md:gap-3">
					{/* Search Bar */}
					<div className="relative hidden sm:block w-48 lg:w-64">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search products, orders..."
							className="pl-9 h-9 text-xs bg-muted/40 focus-visible:bg-background border-muted/80 transition-all rounded-lg"
						/>
					</div>

					{/* Quick Action: New Product */}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger
								render={
									<Button size="sm" className="hidden md:flex gap-1.5 shadow-sm">
										<Plus className="h-4 w-4" />
										<span>Add Product</span>
									</Button>
								}
							></TooltipTrigger>
							<TooltipContent>Create new catalog item</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					{/* Notifications Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									size="icon"
									className="relative rounded-full text-muted-foreground hover:text-foreground"
								>
									<Bell className="h-5 w-5" />
									<span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
								</Button>
							}
						></DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-80 p-2">
							<DropdownMenuLabel className="font-normal flex items-center justify-between">
								<span className="font-semibold text-sm">Notifications</span>
								<Badge variant="outline" className="text-[10px]">
									3 New
								</Badge>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<div className="flex flex-col gap-1 py-1">
								<div className="flex items-start gap-3 p-2 rounded-md hover:bg-accent text-xs cursor-pointer">
									<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
										<ShoppingBag className="h-3.5 w-3.5" />
									</div>
									<div>
										<p className="font-medium text-foreground">New Order #1089 received</p>
										<p className="text-muted-foreground text-[11px]">2 minutes ago • $240.00</p>
									</div>
								</div>
								<div className="flex items-start gap-3 p-2 rounded-md hover:bg-accent text-xs cursor-pointer">
									<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
										<Package className="h-3.5 w-3.5" />
									</div>
									<div>
										<p className="font-medium text-foreground">Low stock alert: Wireless Mouse</p>
										<p className="text-muted-foreground text-[11px]">
											1 hour ago • 3 units remaining
										</p>
									</div>
								</div>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* User Profile Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									className="relative h-9 w-9 rounded-full p-0 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								>
									<Avatar className="h-9 w-9">
										<AvatarImage
											src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
											alt="Alex Johnson"
										/>
										<AvatarFallback>AJ</AvatarFallback>
									</Avatar>
								</Button>
							}
						></DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="end">
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium leading-none">Alex Johnson</p>
									<p className="text-xs leading-none text-muted-foreground">alex.j@aurastore.com</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem className="cursor-pointer">
									<User className="mr-2 h-4 w-4" />
									<span>Store Profile</span>
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer">
									<CreditCard className="mr-2 h-4 w-4" />
									<span>Billing & Plan</span>
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer">
									<Sparkles className="mr-2 h-4 w-4 text-amber-500" />
									<span>Upgrade Pro</span>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
