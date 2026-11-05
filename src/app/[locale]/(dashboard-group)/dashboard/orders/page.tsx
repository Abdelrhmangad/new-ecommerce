'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
	Search,
	SlidersHorizontal,
	MoreHorizontal,
	Eye,
	Truck,
	CheckCircle,
	Clock,
	XCircle,
	Package,
	MapPin,
	Phone,
	User as UserIcon,
	CreditCard,
	Building,
	Banknote
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuGroup,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// --- Types matching your Mongoose Order Schema ---
interface OrderItem {
	product: string;
	nameSnapshot: { en: string; ar: string };
	priceSnapshot: number;
	colorName: string;
	size: string;
	quantity: number;
	images: string[];
}

interface ShippingAddress {
	fullName: string;
	phone: string;
	city: string;
	governorate: string;
	street: string;
	building?: string;
	notes?: string;
}

interface Order {
	_id: string;
	user?: string;
	items: OrderItem[];
	shippingAddress: ShippingAddress;
	itemsTotal: number;
	shippingFee: number;
	totalAmount: number;
	paymentProvider: string;
	paymentReference?: string;
	paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
	status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
	createdAt: string;
}

// --- Dummy Data ---
const initialOrders: Order[] = [
	{
		_id: 'ORD-64a2f81b',
		items: [
			{
				product: 'prod_64a1b2c3d4e5',
				nameSnapshot: { en: 'Relaxed Heavyweight Hoodie', ar: 'هودي ثقيل مريح' },
				priceSnapshot: 45.0,
				colorName: 'Off-White',
				size: 'M',
				quantity: 2,
				images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&auto=format&fit=crop&q=80']
			}
		],
		shippingAddress: {
			fullName: 'Abdelrahman Mohamed',
			phone: '+20 1012345678',
			city: 'Itay El Barud',
			governorate: 'Beheira',
			street: 'El Horreya Street',
			building: '14',
			notes: 'Please call before delivery'
		},
		itemsTotal: 90.0,
		shippingFee: 50.0,
		totalAmount: 140.0,
		paymentProvider: 'paymob',
		paymentReference: 'PAY-98321456',
		paymentStatus: 'paid',
		status: 'processing',
		createdAt: '2026-11-05T10:30:00Z'
	},
	{
		_id: 'ORD-64a2f82c',
		items: [
			{
				product: 'prod_64a1b2c3d4e6',
				nameSnapshot: { en: 'Essential Cotton Crewneck Tee', ar: 'تيشيرت قطني أساسي' },
				priceSnapshot: 20.0,
				colorName: 'Sage Green',
				size: 'L',
				quantity: 1,
				images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80']
			}
		],
		shippingAddress: {
			fullName: 'Mahmoud Hassan',
			phone: '+20 1234567890',
			city: 'Cairo',
			governorate: 'Cairo',
			street: 'Tahrir Square',
			building: '8'
		},
		itemsTotal: 20.0,
		shippingFee: 60.0,
		totalAmount: 80.0,
		paymentProvider: 'cod',
		paymentStatus: 'pending',
		status: 'shipped',
		createdAt: '2026-11-04T14:15:00Z'
	},
	{
		_id: 'ORD-64a2f83d',
		items: [
			{
				product: 'prod_64a1b2c3d4e7',
				nameSnapshot: { en: 'Vintage Washed Denim Jacket', ar: 'جاكيت جينز مغسول عتيق' },
				priceSnapshot: 85.0,
				colorName: 'Indigo Wash',
				size: 'XL',
				quantity: 1,
				images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&auto=format&fit=crop&q=80']
			}
		],
		shippingAddress: {
			fullName: 'Sara Ahmed',
			phone: '+20 1122334455',
			city: 'Alexandria',
			governorate: 'Alexandria',
			street: 'Corniche Road',
			building: '22'
		},
		itemsTotal: 85.0,
		shippingFee: 70.0,
		totalAmount: 155.0,
		paymentProvider: 'stripe',
		paymentReference: 'pi_3Mxxxxxx',
		paymentStatus: 'paid',
		status: 'delivered',
		createdAt: '2026-11-02T09:00:00Z'
	}
];

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>(initialOrders);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);

	// Filter orders by ID or customer name
	const filteredOrders = orders.filter((o) => {
		const q = searchQuery.toLowerCase();
		const id = o._id.toLowerCase();
		const name = o.shippingAddress.fullName.toLowerCase();
		const phone = o.shippingAddress.phone.toLowerCase();
		return id.includes(q) || name.includes(q) || phone.includes(q);
	});

	// Handle status change
	const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
		setOrders((prev) => prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord)));
	};

	const getStatusBadge = (status: Order['status']) => {
		switch (status) {
			case 'processing':
				return (
					<Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-600">
						<Clock className="h-3 w-3" /> Processing
					</Badge>
				);
			case 'shipped':
				return (
					<Badge variant="outline" className="gap-1 text-blue-600 border-blue-200">
						<Truck className="h-3 w-3" /> Shipped
					</Badge>
				);
			case 'delivered':
				return (
					<Badge variant="default" className="gap-1 bg-emerald-600">
						<CheckCircle className="h-3 w-3" /> Delivered
					</Badge>
				);
			case 'cancelled':
				return (
					<Badge variant="destructive" className="gap-1">
						<XCircle className="h-3 w-3" /> Cancelled
					</Badge>
				);
		}
	};

	const getPaymentBadge = (status: Order['paymentStatus']) => {
		switch (status) {
			case 'paid':
				return (
					<span className="text-xs text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
						Paid
					</span>
				);
			case 'pending':
				return (
					<span className="text-xs text-amber-600 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full">
						Pending
					</span>
				);
			case 'failed':
				return (
					<span className="text-xs text-destructive font-semibold bg-destructive/10 px-2 py-0.5 rounded-full">
						Failed
					</span>
				);
			case 'refunded':
				return (
					<span className="text-xs text-purple-600 font-semibold bg-purple-500/10 px-2 py-0.5 rounded-full">
						Refunded
					</span>
				);
		}
	};

	return (
		<div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Orders Management</h1>
					<p className="text-sm text-muted-foreground">
						Track customer purchases, fulfillment status, snapshots, and shipping destinations.
					</p>
				</div>
			</div>

			{/* Search & Filter Toolbar */}
			<Card className="shadow-2xs">
				<CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="relative w-full md:w-96">
						<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search by Order ID, customer name, or phone..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9 h-9 text-xs"
						/>
					</div>
					<div className="flex items-center gap-2 w-full md:w-auto justify-end">
						<Button variant="outline" size="sm" className="gap-1.5 text-xs">
							<SlidersHorizontal className="h-3.5 w-3.5" />
							<span>Filter Status</span>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Orders Table */}
			<Card className="shadow-2xs">
				<CardHeader className="pb-3">
					<CardTitle className="text-lg">Customer Orders ({filteredOrders.length})</CardTitle>
					<CardDescription>
						All monetary amounts and product details reflect the exact snapshots at the time of purchase.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="pl-6">Order ID</TableHead>
								<TableHead>Customer / Shipping</TableHead>
								<TableHead>Items Count</TableHead>
								<TableHead>Total Amount</TableHead>
								<TableHead>Payment</TableHead>
								<TableHead>Fulfillment Status</TableHead>
								<TableHead className="text-right pr-6">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredOrders.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
										No orders found matching your search.
									</TableCell>
								</TableRow>
							) : (
								filteredOrders.map((order) => {
									const totalItemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
									return (
										<TableRow key={order._id} className="hover:bg-muted/50 transition-colors">
											{/* Order ID & Date */}
											<TableCell className="pl-6 py-3 font-mono text-xs font-semibold">
												{order._id}
												<div className="text-[11px] text-muted-foreground font-normal mt-0.5">
													{new Date(order.createdAt).toLocaleDateString()} •{' '}
													{new Date(order.createdAt).toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit'
													})}
												</div>
											</TableCell>

											{/* Customer & City */}
											<TableCell>
												<div className="flex flex-col">
													<span className="font-semibold text-sm leading-tight">
														{order.shippingAddress.fullName}
													</span>
													<span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
														<MapPin className="h-3 w-3 shrink-0" />
														{order.shippingAddress.city},{' '}
														{order.shippingAddress.governorate}
													</span>
												</div>
											</TableCell>

											{/* Items Count */}
											<TableCell className="text-xs font-medium">
												{totalItemsCount} items ({order.items.length} unique)
											</TableCell>

											{/* Total Amount */}
											<TableCell>
												<div className="font-semibold text-sm">
													${order.totalAmount.toFixed(2)}
												</div>
												<div className="text-[10px] text-muted-foreground">
													Sub: ${order.itemsTotal.toFixed(2)} + Ship: $
													{order.shippingFee.toFixed(2)}
												</div>
											</TableCell>

											{/* Payment Provider & Status */}
											<TableCell>
												<div className="flex flex-col gap-1 items-start">
													<span className="uppercase text-[10px] font-bold tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
														{order.paymentProvider}
													</span>
													{getPaymentBadge(order.paymentStatus)}
												</div>
											</TableCell>

											{/* Status */}
											<TableCell>{getStatusBadge(order.status)}</TableCell>

											{/* Actions & Status Changer */}
											<TableCell className="text-right pr-6">
												<DropdownMenu>
													<DropdownMenuTrigger
														render={
															<Button variant="ghost" size="icon" className="h-8 w-8">
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														}
													></DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="w-52">
														{/* Wrap your grouped items inside DropdownMenuGroup */}
														<DropdownMenuGroup>
															<DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
																Change Status
															</DropdownMenuLabel>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																onClick={() =>
																	handleStatusChange(order._id, 'processing')
																}
																className="cursor-pointer text-xs"
															>
																<Clock className="h-3.5 w-3.5 mr-2 text-amber-500" />
																<span>Mark as Processing</span>
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => handleStatusChange(order._id, 'shipped')}
																className="cursor-pointer text-xs"
															>
																<Truck className="h-3.5 w-3.5 mr-2 text-blue-500" />
																<span>Mark as Shipped</span>
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	handleStatusChange(order._id, 'delivered')
																}
																className="cursor-pointer text-xs"
															>
																<CheckCircle className="h-3.5 w-3.5 mr-2 text-emerald-500" />
																<span>Mark as Delivered</span>
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	handleStatusChange(order._id, 'cancelled')
																}
																className="cursor-pointer text-xs text-destructive focus:text-destructive"
															>
																<XCircle className="h-3.5 w-3.5 mr-2" />
																<span>Cancel Order</span>
															</DropdownMenuItem>
														</DropdownMenuGroup>

														<DropdownMenuSeparator />

														<DropdownMenuGroup>
															<DropdownMenuItem
																onClick={() => {
																	setSelectedOrder(order);
																	setIsDetailsOpen(true);
																}}
																className="cursor-pointer text-xs font-medium"
															>
																<Eye className="h-3.5 w-3.5 mr-2" />
																<span>View Full Details</span>
															</DropdownMenuItem>
														</DropdownMenuGroup>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Order Details Modal */}
			<Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
				<DialogContent className="md:max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-4">
							<span>Order Details: {selectedOrder?._id}</span>
							{selectedOrder && getStatusBadge(selectedOrder.status)}
						</DialogTitle>
						<DialogDescription>
							Placed on {selectedOrder && new Date(selectedOrder.createdAt).toLocaleString()}
						</DialogDescription>
					</DialogHeader>

					{selectedOrder && (
						<div className="space-y-6 py-2">
							{/* Customer & Shipping Address Info */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="border rounded-lg p-4 space-y-2 bg-muted/20">
									<h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
										<UserIcon className="h-3.5 w-3.5" /> Customer & Shipping
									</h4>
									<div className="text-sm font-semibold">
										{selectedOrder.shippingAddress.fullName}
									</div>
									<div className="text-xs text-muted-foreground flex items-center gap-1">
										<Phone className="h-3 w-3" /> {selectedOrder.shippingAddress.phone}
									</div>
									<div className="text-xs text-muted-foreground flex items-start gap-1 pt-1">
										<MapPin className="h-3 w-3 shrink-0 mt-0.5" />
										<span>
											{selectedOrder.shippingAddress.street}, Bldg{' '}
											{selectedOrder.shippingAddress.building || 'N/A'}
											<br />
											{selectedOrder.shippingAddress.city},{' '}
											{selectedOrder.shippingAddress.governorate}
										</span>
									</div>
									{selectedOrder.shippingAddress.notes && (
										<div className="text-xs italic bg-background p-2 rounded border mt-2">
											&quot;{selectedOrder.shippingAddress.notes}&quot;
										</div>
									)}
								</div>

								<div className="border rounded-lg p-4 space-y-3 bg-muted/20">
									<h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
										<Banknote className="h-3.5 w-3.5" /> Payment & Summary
									</h4>
									<div className="flex justify-between text-xs">
										<span className="text-muted-foreground">Payment Method:</span>
										<span className="font-semibold uppercase flex items-center gap-1">
											{selectedOrder.paymentProvider === 'cod'
												? 'Cash on Delivery (COD)'
												: selectedOrder.paymentProvider}
										</span>
									</div>
									<div className="flex justify-between text-xs">
										<span className="text-muted-foreground">Payment Status:</span>
										<span>{getPaymentBadge(selectedOrder.paymentStatus)}</span>
									</div>
									{selectedOrder.paymentProvider !== 'cod' && selectedOrder.paymentReference && (
										<div className="flex justify-between text-xs">
											<span className="text-muted-foreground">Reference ID:</span>
											<span className="font-mono">{selectedOrder.paymentReference}</span>
										</div>
									)}
									<Separator />
									<div className="flex justify-between text-xs">
										<span className="text-muted-foreground">Items Subtotal:</span>
										<span>${selectedOrder.itemsTotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between text-xs">
										<span className="text-muted-foreground">Shipping Fee:</span>
										<span>${selectedOrder.shippingFee.toFixed(2)}</span>
									</div>
									<div className="flex justify-between text-sm font-bold pt-1 border-t">
										<span>Total Due on Delivery:</span>
										<span>${selectedOrder.totalAmount.toFixed(2)}</span>
									</div>
								</div>
							</div>

							{/* Purchased Items Snapshot Table */}
							<div className="space-y-3">
								<h4 className="text-sm font-semibold">Purchased Items Snapshot</h4>
								<div className="w-full overflow-x-auto border rounded-lg max-w-[calc(100vw-4rem)] sm:max-w-none">
									<Table className="w-full min-w-[500px]">
										<TableHeader className="bg-muted/50">
											<TableRow>
												<TableHead className="pl-4">Item Snapshot</TableHead>
												<TableHead>Variant</TableHead>
												<TableHead>Price</TableHead>
												<TableHead>Qty</TableHead>
												<TableHead className="text-right pr-4">Total</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{selectedOrder.items.map((item, idx) => (
												<TableRow key={idx}>
													<TableCell className="pl-4 py-3">
														<div className="flex items-center gap-3">
															<div className="relative h-10 w-10 rounded overflow-hidden bg-muted border shrink-0">
																{item.images[0] ? (
																	<Image
																		src={item.images[0]}
																		alt={item.nameSnapshot.en}
																		fill
																		className="object-cover"
																	/>
																) : (
																	<Package className="h-4 w-4 m-auto text-muted-foreground" />
																)}
															</div>
															<div className="flex flex-col">
																<span className="font-semibold text-xs leading-tight">
																	{item.nameSnapshot.en}
																</span>
																<span className="text-[10px] text-muted-foreground">
																	{item.nameSnapshot.ar}
																</span>
															</div>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-1.5 text-xs">
															<Badge variant="outline" className="text-[10px]">
																{item.colorName}
															</Badge>
															<Badge variant="secondary" className="text-[10px]">
																Size: {item.size}
															</Badge>
														</div>
													</TableCell>
													<TableCell className="text-xs">
														${item.priceSnapshot.toFixed(2)}
													</TableCell>
													<TableCell className="text-xs font-semibold">
														{item.quantity}
													</TableCell>
													<TableCell className="text-right pr-4 text-xs font-semibold">
														${(item.priceSnapshot * item.quantity).toFixed(2)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>
						</div>
					)}

					<DialogFooter>
						<Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
