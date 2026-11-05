import React from 'react';
import Link from 'next/link';
import {
	DollarSign,
	ShoppingBag,
	Users,
	TrendingUp,
	ArrowUpRight,
	ArrowDownRight,
	Package,
	Plus,
	Eye,
	MoreVertical
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// --- Dummy Data ---
const metrics = [
	{
		title: 'Total Revenue',
		value: '$45,231.89',
		change: '+20.1%',
		trend: 'up',
		description: 'vs last month',
		icon: DollarSign
	},
	{
		title: 'Total Orders',
		value: '+2,350',
		change: '+180.1%',
		trend: 'up',
		description: 'vs last month',
		icon: ShoppingBag
	},
	{
		title: 'Customers',
		value: '+12,234',
		change: '+19%',
		trend: 'up',
		description: 'vs last month',
		icon: Users
	},
	{
		title: 'Conversion Rate',
		value: '3.2%',
		change: '-0.4%',
		trend: 'down',
		description: 'vs last month',
		icon: TrendingUp
	}
];

const recentOrders = [
	{
		id: 'ORD-7352',
		customer: {
			name: 'Sophia Carter',
			email: 'sophia@example.com',
			avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80'
		},
		product: 'Over-Ear Wireless Headphones',
		amount: '$299.00',
		status: 'Completed',
		date: '2 mins ago'
	},
	{
		id: 'ORD-7351',
		customer: {
			name: 'Liam Davies',
			email: 'liam@example.com',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80'
		},
		product: 'Minimalist Leather Backpack',
		amount: '$145.50',
		status: 'Processing',
		date: '15 mins ago'
	},
	{
		id: 'ORD-7350',
		customer: {
			name: 'Emma Watson',
			email: 'emma@example.com',
			avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80'
		},
		product: 'Smart Fitness Watch v2',
		amount: '$199.99',
		status: 'Completed',
		date: '1 hour ago'
	},
	{
		id: 'ORD-7349',
		customer: {
			name: 'Noah Smith',
			email: 'noah@example.com',
			avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80'
		},
		product: 'Ergonomic Desk Mat',
		amount: '$38.00',
		status: 'Shipped',
		date: '3 hours ago'
	},
	{
		id: 'ORD-7348',
		customer: {
			name: 'Olivia Martinez',
			email: 'olivia@example.com',
			avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'
		},
		product: 'Ceramic Coffee Mug (Set of 2)',
		amount: '$24.00',
		status: 'Cancelled',
		date: '5 hours ago'
	}
];

const topProducts = [
	{
		name: 'Over-Ear Wireless Headphones',
		category: 'Electronics',
		sales: 142,
		revenue: '$42,458'
	},
	{
		name: 'Minimalist Leather Backpack',
		category: 'Accessories',
		sales: 98,
		revenue: '$14,259'
	},
	{
		name: 'Smart Fitness Watch v2',
		category: 'Wearables',
		sales: 87,
		revenue: '$17,399'
	},
	{
		name: 'Mechanical Keyboard RGB',
		category: 'Electronics',
		sales: 64,
		revenue: '$8,320'
	}
];

const statusStyles: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
	Completed: 'default',
	Processing: 'secondary',
	Shipped: 'outline',
	Cancelled: 'destructive'
};

export default function DashboardOverviewPage() {
	return (
		<div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Overview</h1>
					<p className="text-sm text-muted-foreground">
						Here is a snapshot of your store performace and recent sales.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button size="sm" className="gap-1.5 shadow-sm">
						<Plus className="h-4 w-4" />
						<span>Add Product</span>
					</Button>
				</div>
			</div>

			{/* Metric Cards Grid */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{metrics.map((item, index) => {
					const Icon = item.icon;
					const isUp = item.trend === 'up';
					return (
						<Card key={index} className="shadow-sm transition-all hover:shadow-md">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									{item.title}
								</CardTitle>
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
									<Icon className="h-4 w-4" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{item.value}</div>
								<div className="flex items-center gap-1 mt-1 text-xs">
									<span
										className={`flex items-center font-semibold ${
											isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
										}`}
									>
										{isUp ? (
											<ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
										) : (
											<ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
										)}
										{item.change}
									</span>
									<span className="text-muted-foreground">{item.description}</span>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Bottom Section: Recent Orders & Top Selling Products */}
			<div className="grid gap-6 lg:grid-cols-7">
				{/* Recent Orders Table (4/7 width on desktop) */}
				<Card className="lg:col-span-4 shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="text-lg">Recent Orders</CardTitle>
							<CardDescription>You received 12 orders today across all channels.</CardDescription>
						</div>
						<Button
							variant="outline"
							size="sm"
							render={
								<Link href="/dashboard/orders">
									<span>View All</span>
									<Eye className="ml-1.5 h-3.5 w-3.5" />
								</Link>
							}
							className="hidden sm:flex"
						></Button>
					</CardHeader>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="pl-6">Customer</TableHead>
									<TableHead className="hidden md:table-cell">Product</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right pr-6">Amount</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentOrders.map((order) => (
									<TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
										<TableCell className="pl-6">
											<div className="flex items-center gap-3">
												<Avatar className="h-8 w-8">
													<AvatarImage
														src={order.customer.avatar}
														alt={order.customer.name}
													/>
													<AvatarFallback>
														{order.customer.name.slice(0, 2).toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div className="flex flex-col">
													<span className="text-sm font-medium leading-none">
														{order.customer.name}
													</span>
													<span className="text-xs text-muted-foreground mt-0.5">
														{order.id}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="hidden md:table-cell max-w-[180px] truncate text-xs text-muted-foreground">
											{order.product}
										</TableCell>
										<TableCell>
											<Badge
												variant={statusStyles[order.status] || 'secondary'}
												className="text-[11px] px-2 py-0.5"
											>
												{order.status}
											</Badge>
										</TableCell>
										<TableCell className="text-right pr-6 font-semibold text-sm">
											{order.amount}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				{/* Top Selling Products Card (3/7 width on desktop) */}
				<Card className="lg:col-span-3 shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="text-lg">Top Products</CardTitle>
							<CardDescription>Best performing items by sales volume this month.</CardDescription>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<Button variant="ghost" size="icon" className="h-8 w-8">
										<MoreVertical className="h-4 w-4" />
									</Button>
								}
							></DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>This Week</DropdownMenuItem>
								<DropdownMenuItem>This Month</DropdownMenuItem>
								<DropdownMenuItem>All Time</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</CardHeader>
					<CardContent className="space-y-4">
						{topProducts.map((product, idx) => (
							<div
								key={idx}
								className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/60 transition-colors"
							>
								<div className="flex items-center gap-3 min-w-0">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<Package className="h-4 w-4" />
									</div>
									<div className="flex flex-col min-w-0">
										<p className="text-sm font-medium leading-none truncate">{product.name}</p>
										<p className="text-xs text-muted-foreground mt-1">
											{product.category} • {product.sales} sales
										</p>
									</div>
								</div>
								<div className="text-right shrink-0">
									<p className="text-sm font-semibold">{product.revenue}</p>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
