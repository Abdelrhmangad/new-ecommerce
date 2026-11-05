'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Search, SlidersHorizontal, MoreHorizontal, Edit, Trash2, Package, Eye, Layers, ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Link } from '@/i18n/routing';
import { ColorImageManagerModal } from '@/features/dashboard/components/ProductImagesHandler';

// --- Dummy Data matching your Mongoose Schema ---
interface Variant {
	colorName: string;
	size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
	quantity: number;
	sku: string;
}

interface ProductColor {
	name: { en: string; ar?: string };
	hex: string;
	images: {
		primary: string;
		secondary?: string;
		gallery?: string[];
	};
}

interface Product {
	_id: string;
	name: { en: string; ar?: string };
	description: { en: string; ar?: string };
	slug: string;
	category: string;
	price: number;
	compareAtPrice?: number;
	sizes: string[];
	colors: ProductColor[];
	variants: Variant[];
	isActive: boolean;
	totalStock?: number;
	isOnSale?: boolean;
	discountPercentage?: number;
}

const initialProducts: Product[] = [
	{
		_id: 'prod_64a1b2c3d4e5',
		name: { en: 'Relaxed Heavyweight Hoodie', ar: 'هودي ثقيل مريح' },
		description: { en: 'Premium cotton fleece hoodie designed for everyday casual wear.' },
		slug: 'relaxed-heavyweight-hoodie',
		category: 'Hoodies & Sweatshirts',
		price: 45.0,
		compareAtPrice: 60.0,
		sizes: ['S', 'M', 'L', 'XL'],
		colors: [
			{
				name: { en: 'Off-White' },
				hex: '#F5F5F0',
				images: {
					primary: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&auto=format&fit=crop&q=80'
				}
			},
			{
				name: { en: 'Charcoal' },
				hex: '#333333',
				images: {
					primary:
						'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&auto=format&fit=crop&q=80'
				}
			}
		],
		variants: [
			{ colorName: 'Off-White', size: 'S', quantity: 12, sku: 'HOOD-OW-S' },
			{ colorName: 'Off-White', size: 'M', quantity: 25, sku: 'HOOD-OW-M' },
			{ colorName: 'Off-White', size: 'L', quantity: 8, sku: 'HOOD-OW-L' },
			{ colorName: 'Charcoal', size: 'M', quantity: 14, sku: 'HOOD-CH-M' },
			{ colorName: 'Charcoal', size: 'XL', quantity: 4, sku: 'HOOD-CH-XL' }
		],
		isActive: true,
		totalStock: 63,
		isOnSale: true,
		discountPercentage: 25
	},
	{
		_id: 'prod_64a1b2c3d4e6',
		name: { en: 'Essential Cotton Crewneck Tee', ar: 'تيشيرت قطني أساسي' },
		description: { en: 'Breathable combed ring-spun cotton t-shirt with a modern relaxed fit.' },
		slug: 'essential-cotton-crewneck-tee',
		category: 'T-Shirts',
		price: 20.0,
		sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
		colors: [
			{
				name: { en: 'Sage Green' },
				hex: '#8A9A86',
				images: {
					primary:
						'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80'
				}
			}
		],
		variants: [
			{ colorName: 'Sage Green', size: 'S', quantity: 30, sku: 'TEE-SG-S' },
			{ colorName: 'Sage Green', size: 'M', quantity: 45, sku: 'TEE-SG-M' },
			{ colorName: 'Sage Green', size: 'L', quantity: 15, sku: 'TEE-SG-L' },
			{ colorName: 'Sage Green', size: 'XL', quantity: 0, sku: 'TEE-SG-XL' }
		],
		isActive: true,
		totalStock: 90,
		isOnSale: false,
		discountPercentage: 0
	},
	{
		_id: 'prod_64a1b2c3d4e7',
		name: { en: 'Vintage Washed Denim Jacket', ar: 'جاكيت جينز مغسول عتيق' },
		description: { en: 'Classic trucker jacket featuring heavy stonewash and durable copper hardware.' },
		slug: 'vintage-washed-denim-jacket',
		category: 'Outerwear',
		price: 85.0,
		compareAtPrice: 110.0,
		sizes: ['M', 'L', 'XL'],
		colors: [
			{
				name: { en: 'Indigo Wash' },
				hex: '#3F51B5',
				images: {
					primary:
						'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&auto=format&fit=crop&q=80'
				}
			}
		],
		variants: [
			{ colorName: 'Indigo Wash', size: 'M', quantity: 6, sku: 'DEN-IND-M' },
			{ colorName: 'Indigo Wash', size: 'L', quantity: 10, sku: 'DEN-IND-L' },
			{ colorName: 'Indigo Wash', size: 'XL', quantity: 3, sku: 'DEN-IND-XL' }
		],
		isActive: true,
		totalStock: 19,
		isOnSale: true,
		discountPercentage: 23
	}
];

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	// Filter products by name (en/ar) or ID
	const filteredProducts = products.filter((p) => {
		const q = searchQuery.toLowerCase();
		const nameEn = p.name.en.toLowerCase();
		const nameAr = p.name.ar ? p.name.ar.toLowerCase() : '';
		const id = p._id.toLowerCase();
		return nameEn.includes(q) || nameAr.includes(q) || id.includes(q);
	});

	const handleEditClick = (product: Product) => {
		setSelectedProduct({ ...product }); // clone for editing state
		setIsEditDialogOpen(true);
	};

	const handleSaveProduct = () => {
		if (!selectedProduct) return;
		setProducts((prev) => prev.map((p) => (p._id === selectedProduct._id ? selectedProduct : p)));
		setIsEditDialogOpen(false);
	};

	// Modal states
	const [imageProductId, setImageProductId] = useState<string | null>(null);
	const imageProduct = products.find((product) => product._id === imageProductId) ?? null;

	return (
		<div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Products Catalog</h1>
					<p className="text-sm text-muted-foreground">
						Manage your casual clothing collection, variants, inventory, and pricing.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button size="sm" className="gap-1.5 shadow-sm">
						<Plus className="h-4 w-4" />
						<span>Add Product</span>
					</Button>
				</div>
			</div>

			{/* Search & Controls Toolbar */}
			<Card className="shadow-sm">
				<CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="relative w-full md:w-96">
						<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search by product name or ID..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9 h-9 text-xs"
						/>
					</div>
					<div className="flex items-center gap-2 w-full md:w-auto justify-end">
						<Button variant="outline" size="sm" className="gap-1.5 text-xs">
							<SlidersHorizontal className="h-3.5 w-3.5" />
							<span>Filter Categories</span>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Products Table */}
			<Card className="shadow-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-lg">All Products ({filteredProducts.length})</CardTitle>
					<CardDescription>
						Stock is tracked dynamically per color and size variant combination.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="pl-6">Product</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Price / Compare</TableHead>
								<TableHead>Colors & Variants</TableHead>
								<TableHead>Total Stock</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right pr-6">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredProducts.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
										No products found matching your search.
									</TableCell>
								</TableRow>
							) : (
								filteredProducts.map((product) => {
									const calculatedStock = product.variants.reduce((acc, v) => acc + v.quantity, 0);
									return (
										<TableRow key={product._id} className="hover:bg-muted/50 transition-colors">
											{/* Product Name & Thumbnail */}
											<TableCell className="pl-6 py-3">
												<div className="flex items-center gap-3">
													<div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0 border">
														{product.colors[0]?.images?.primary ? (
															<Image
																src={product.colors[0].images.primary}
																alt={product.name.en}
																fill
																className="object-cover"
															/>
														) : (
															<div className="flex h-full w-full items-center justify-center">
																<Package className="h-5 w-5 text-muted-foreground" />
															</div>
														)}
													</div>
													<div className="flex flex-col">
														<span className="font-semibold text-sm leading-tight">
															{product.name.en}
														</span>
														<span className="text-[11px] text-muted-foreground mt-0.5">
															ID: {product._id} • /{product.slug}
														</span>
													</div>
												</div>
											</TableCell>

											{/* Category */}
											<TableCell className="text-xs text-muted-foreground font-medium">
												{product.category}
											</TableCell>

											{/* Price & CompareAtPrice */}
											<TableCell>
												<div className="flex items-center gap-2">
													<span className="font-semibold text-sm">
														${product.price.toFixed(2)}
													</span>
													{product.compareAtPrice &&
														product.compareAtPrice > product.price && (
															<span className="text-xs text-muted-foreground line-through">
																${product.compareAtPrice.toFixed(2)}
															</span>
														)}
												</div>
												{product.isOnSale && (
													<Badge
														variant="secondary"
														className="mt-0.5 text-[10px] text-emerald-600 bg-emerald-500/10"
													>
														{product.discountPercentage}% OFF SALE
													</Badge>
												)}
											</TableCell>

											{/* Colors & Variants Grouping */}
											<TableCell>
												<div className="flex flex-col gap-1.5">
													{/* Color Swatches */}
													<div className="flex items-center gap-1.5">
														{product.colors.map((col, idx) => (
															<span
																key={idx}
																className="h-4 w-4 rounded-full border shadow-2xs"
																style={{ backgroundColor: col.hex }}
																title={col.name.en}
															/>
														))}
														<span className="text-xs text-muted-foreground ml-1">
															({product.colors.length} colors)
														</span>
													</div>
													{/* Sizes Available */}
													<div className="flex items-center gap-1 text-[11px] text-muted-foreground">
														<Layers className="h-3 w-3" />
														<span>Sizes: {product.sizes.join(', ')}</span>
													</div>
												</div>
											</TableCell>

											{/* Total Stock */}
											<TableCell>
												<div className="flex items-center gap-1.5">
													<span
														className={`inline-block h-2 w-2 rounded-full ${
															calculatedStock > 10
																? 'bg-emerald-500'
																: calculatedStock > 0
																	? 'bg-amber-500'
																	: 'bg-destructive'
														}`}
													/>
													<span className="text-sm font-medium">{calculatedStock} units</span>
												</div>
											</TableCell>

											{/* Active Status */}
											<TableCell>
												<Badge
													variant={product.isActive ? 'default' : 'outline'}
													className="text-[11px] px-2 py-0.5"
												>
													{product.isActive ? 'Active' : 'Hidden'}
												</Badge>
											</TableCell>

											{/* Actions */}
											<TableCell className="text-right pr-6">
												<DropdownMenu>
													<DropdownMenuTrigger
														render={
															<Button variant="ghost" size="icon" className="h-8 w-8">
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														}
													></DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="w-56">
														<DropdownMenuItem
															onClick={() => handleEditClick(product)}
															className="cursor-pointer gap-2"
														>
															<Edit className="h-3.5 w-3.5" />
															<span>Edit Product & Variants</span>
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => setImageProductId(product._id)}
															className="cursor-pointer gap-2"
														>
															<ImageIcon className="h-3.5 w-3.5 text-primary" />
															<span>Manage Color Images</span>
														</DropdownMenuItem>
														<DropdownMenuItem className="cursor-pointer">
															<Link
																href={`/products/${`lightweight-track-jacket`}`}
																target="_blank"
																rel="noopener noreferrer"
																className="flex items-center gap-2"
															>
																<Eye className="h-3.5 w-3.5" />
																<span>View Storefront Preview</span>
															</Link>
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10">
															<Trash2 className="h-3.5 w-3.5" />
															<span>Delete / Soft-Hide</span>
														</DropdownMenuItem>
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

			{imageProduct && (
				<ColorImageManagerModal
					key={imageProduct._id}
					isOpen
					onClose={() => setImageProductId(null)}
					colors={imageProduct.colors}
					onSaveColors={(updatedColors) => {
						setProducts((previousProducts) =>
							previousProducts.map((product) =>
								product._id === imageProduct._id
									? { ...product, colors: updatedColors }
									: product
							)
						);
						setSelectedProduct((previousProduct) =>
							previousProduct?._id === imageProduct._id
								? { ...previousProduct, colors: updatedColors }
								: previousProduct
						);
					}}
				/>
			)}

			{/* Edit Product Modal */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="max-w-3xl md:max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Edit Product: {selectedProduct?.name.en}</DialogTitle>
						<DialogDescription>
							Modify general info, pricing, and grouped variant stock levels (Color & Size combinations).
						</DialogDescription>
					</DialogHeader>

					{selectedProduct && (
						<Tabs defaultValue="general" className="w-full mt-2">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="general">General & Pricing</TabsTrigger>
								<TabsTrigger value="variants">
									Variants & Stock ({selectedProduct.variants.length})
								</TabsTrigger>
							</TabsList>

							{/* Tab 1: General Info */}
							<TabsContent value="general" className="space-y-4 py-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="product-name">Product Name (English)</Label>
										<Input
											id="product-name"
											value={selectedProduct.name.en}
											onChange={(e) =>
												setSelectedProduct({
													...selectedProduct,
													name: { ...selectedProduct.name, en: e.target.value }
												})
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="product-slug">Slug</Label>
										<Input
											id="product-slug"
											value={selectedProduct.slug}
											onChange={(e) =>
												setSelectedProduct({ ...selectedProduct, slug: e.target.value })
											}
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="product-name">Product Name (Arabic)</Label>
										<Input
											id="product-name"
											value={selectedProduct.name.ar}
											onChange={(e) =>
												setSelectedProduct({
													...selectedProduct,
													name: { ...selectedProduct.name, ar: e.target.value }
												})
											}
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="price">Price ($)</Label>
										<Input
											id="price"
											type="number"
											value={selectedProduct.price}
											onChange={(e) =>
												setSelectedProduct({
													...selectedProduct,
													price: parseFloat(e.target.value) || 0
												})
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="compare-price">Compare At Price ($)</Label>
										<Input
											id="compare-price"
											type="number"
											value={selectedProduct.compareAtPrice || ''}
											onChange={(e) =>
												setSelectedProduct({
													...selectedProduct,
													compareAtPrice: e.target.value
														? parseFloat(e.target.value)
														: undefined
												})
											}
										/>
									</div>
								</div>

								<div className="flex items-center justify-between p-4 rounded-lg border bg-muted/40">
									<div className="space-y-0.5">
										<Label className="text-base font-medium">Active Store Status</Label>
										<p className="text-xs text-muted-foreground">
											When disabled, the product is soft-hidden from public storefront browsing.
										</p>
									</div>
									<Switch
										checked={selectedProduct.isActive}
										className="cursor-pointer"
										onCheckedChange={(checked) =>
											setSelectedProduct({ ...selectedProduct, isActive: checked })
										}
									/>
								</div>
							</TabsContent>

							{/* Tab 2: Variants & Stock Grouping */}
							<TabsContent value="variants" className="space-y-4 py-4">
								<div className="flex items-center justify-between">
									<p className="text-xs text-muted-foreground">
										Stock is tracked per (color, size) combination with unique SKUs.
									</p>
									<Button variant="outline" size="sm" className="h-8 text-xs">
										+ Add New Variant
									</Button>
								</div>

								<div className="border rounded-md overflow-hidden">
									<Table>
										<TableHeader className="bg-muted/50">
											<TableRow>
												<TableHead>Color Name</TableHead>
												<TableHead>Size</TableHead>
												<TableHead>SKU</TableHead>
												<TableHead className="w-32">Quantity</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{selectedProduct.variants.map((variant, idx) => (
												<TableRow key={idx}>
													<TableCell className="font-medium text-xs">
														{variant.colorName}
													</TableCell>
													<TableCell>
														<Badge variant="outline" className="text-xs font-semibold">
															{variant.size}
														</Badge>
													</TableCell>
													<TableCell className="text-xs text-muted-foreground font-mono">
														{variant.sku}
													</TableCell>
													<TableCell>
														<Input
															type="number"
															min="0"
															className="h-8 text-xs"
															value={variant.quantity}
															onChange={(e) => {
																const val = parseInt(e.target.value) || 0;
																const updatedVariants = [...selectedProduct.variants];
																updatedVariants[idx].quantity = val;
																setSelectedProduct({
																	...selectedProduct,
																	variants: updatedVariants
																});
															}}
														/>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</TabsContent>
						</Tabs>
					)}

					<DialogFooter className="mt-4">
						<Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSaveProduct}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
