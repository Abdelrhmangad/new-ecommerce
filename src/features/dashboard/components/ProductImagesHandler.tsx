'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Plus, Image as ImageIcon, Palette } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// --- Types matching your schema ---
interface ProductColor {
	name: { en: string; ar?: string };
	hex: string;
	images: {
		primary: string;
		secondary?: string;
		gallery?: string[];
	};
}

interface ColorImageManagerModalProps {
	isOpen: boolean;
	onClose: () => void;
	colors: ProductColor[];
	onSaveColors: (updatedColors: ProductColor[]) => void;
}

export function ColorImageManagerModal({
	isOpen,
	onClose,
	colors: initialColors,
	onSaveColors
}: ColorImageManagerModalProps) {
	const [colors, setColors] = useState<ProductColor[]>(() =>
		initialColors.map((color) => ({
			...color,
			name: { ...color.name },
			images: {
				...color.images,
				gallery: [...(color.images.gallery ?? [])]
			}
		}))
	);
	const [activeColorIndex, setActiveColorIndex] = useState(0);
	const [newGalleryUrl, setNewGalleryUrl] = useState('');

	if (!colors.length) return null;

	const currentColor = colors[activeColorIndex];

	// Update primary or secondary image
	const handleUpdateMainImage = (type: 'primary' | 'secondary', url: string) => {
		setColors((previousColors) =>
			previousColors.map((color, index) =>
				index === activeColorIndex
					? { ...color, images: { ...color.images, [type]: url } }
					: color
			)
		);
	};

	// Add gallery image
	const handleAddGalleryImage = () => {
		if (!newGalleryUrl.trim()) return;
		setColors((previousColors) =>
			previousColors.map((color, index) =>
				index === activeColorIndex
					? {
							...color,
							images: {
								...color.images,
								gallery: [...(color.images.gallery ?? []), newGalleryUrl.trim()]
							}
						}
					: color
			)
		);
		setNewGalleryUrl('');
	};

	// Delete gallery image by index
	const handleDeleteGalleryImage = (galleryIdx: number) => {
		setColors((previousColors) =>
			previousColors.map((color, index) =>
				index === activeColorIndex
					? {
							...color,
							images: {
								...color.images,
								gallery: (color.images.gallery ?? []).filter((_, i) => i !== galleryIdx)
							}
						}
					: color
			)
		);
	};

	const handleSaveChanges = () => {
		onSaveColors(colors);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="md:max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Palette className="h-5 w-5 text-primary" />
						<span>Manage Color Variants & Images</span>
					</DialogTitle>
					<DialogDescription>
						Configure primary, hover-swap (secondary), and gallery shots for each color variant.
					</DialogDescription>
				</DialogHeader>

				{/* Color Tab Selection Header */}
				<div className="flex items-center gap-2 overflow-x-auto pb-2 border-b">
					{colors.map((col, idx) => (
						<button
							key={idx}
							onClick={() => setActiveColorIndex(idx)}
							className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all shrink-0 ${
								activeColorIndex === idx
									? 'bg-primary text-primary-foreground border-primary shadow-sm'
									: 'bg-muted/40 hover:bg-muted text-muted-foreground'
							}`}
						>
							<span
								className="h-3.5 w-3.5 rounded-full border shadow-2xs"
								style={{ backgroundColor: col.hex }}
							/>
							<span>{col.name.en}</span>
							<Badge variant="outline" className="ml-1 text-[10px] px-1 py-0">
								{1 + (col.images.secondary ? 1 : 0) + (col.images.gallery?.length || 0)} imgs
							</Badge>
						</button>
					))}
				</div>

				{/* Active Color Image Management Panel */}
				<div className="space-y-6 py-2">
					{/* Color Info Badge */}
					<div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
						<div className="flex items-center gap-3">
							<div
								className="h-8 w-8 rounded-full border shadow-sm"
								style={{ backgroundColor: currentColor.hex }}
							/>
							<div>
								<h4 className="text-sm font-semibold">{currentColor.name.en} Color Variant</h4>
								<p className="text-xs text-muted-foreground font-mono">HEX: {currentColor.hex}</p>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Primary Image (Default store view) */}
						<Card className="shadow-2xs">
							<CardContent className="p-4 space-y-3">
								<div className="flex items-center justify-between">
									<Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Primary Image (Default View)
									</Label>
									<Badge variant="secondary" className="text-[10px]">
										Required
									</Badge>
								</div>
								<div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted border flex items-center justify-center">
									{currentColor.images.primary ? (
										<Image
											src={currentColor.images.primary}
											alt={`${currentColor.name.en} primary`}
											fill
											className="object-cover"
										/>
									) : (
										<ImageIcon className="h-10 w-10 text-muted-foreground/40" />
									)}
								</div>
								<div className="space-y-1.5">
									<Label className="text-xs">Image URL or Upload</Label>
									<div className="flex gap-2">
										<Input
											className="text-xs h-9"
											value={currentColor.images.primary}
											onChange={(e) => handleUpdateMainImage('primary', e.target.value)}
											placeholder="https://images.unsplash.com/..."
										/>
										<Button variant="outline" size="sm" className="h-9 shrink-0 gap-1 text-xs">
											<Upload className="h-3.5 w-3.5" />
											<span>Upload</span>
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Secondary Image (Hover swap view) */}
						<Card className="shadow-2xs">
							<CardContent className="p-4 space-y-3">
								<div className="flex items-center justify-between">
									<Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Secondary Image (Hover Swap)
									</Label>
									<Badge variant="outline" className="text-[10px]">
										Optional
									</Badge>
								</div>
								<div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted border flex items-center justify-center">
									{currentColor.images.secondary ? (
										<Image
											src={currentColor.images.secondary}
											alt={`${currentColor.name.en} secondary`}
											fill
											className="object-cover"
										/>
									) : (
										<div className="text-center p-4">
											<ImageIcon className="h-8 w-8 text-muted-foreground/30 mx-auto mb-1" />
											<span className="text-[11px] text-muted-foreground">
												No hover image set
											</span>
										</div>
									)}
								</div>
								<div className="space-y-1.5">
									<Label className="text-xs">Image URL or Upload</Label>
									<div className="flex gap-2">
										<Input
											className="text-xs h-9"
											value={currentColor.images.secondary || ''}
											onChange={(e) => handleUpdateMainImage('secondary', e.target.value)}
											placeholder="https://images.unsplash.com/..."
										/>
										{currentColor.images.secondary && (
											<Button
												variant="ghost"
												size="icon"
												className="h-9 w-9 text-destructive hover:bg-destructive/10 shrink-0"
												onClick={() => handleUpdateMainImage('secondary', '')}
												title="Remove secondary image"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Gallery Shots for Single Product Page */}
					<div className="space-y-3 pt-2">
						<div className="flex items-center justify-between">
							<div>
								<h4 className="text-sm font-semibold">Additional Gallery Shots</h4>
								<p className="text-xs text-muted-foreground">
									Extra angles shown in the modal light-box on the single product page.
								</p>
							</div>
							<Badge variant="outline">{currentColor.images.gallery?.length || 0} images</Badge>
						</div>

						{/* Add Gallery URL Input */}
						<div className="flex gap-2">
							<Input
								className="text-xs"
								placeholder="Paste image URL to add to gallery..."
								value={newGalleryUrl}
								onChange={(e) => setNewGalleryUrl(e.target.value)}
							/>
							<Button onClick={handleAddGalleryImage} size="sm" className="gap-1 text-xs shrink-0">
								<Plus className="h-3.5 w-3.5" />
								<span>Add Shot</span>
							</Button>
						</div>

						{/* Gallery Grid */}
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
							{currentColor.images.gallery?.map((imgUrl, gIdx) => (
								<div
									key={gIdx}
									className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
								>
									<Image src={imgUrl} alt="Gallery shot" fill className="object-cover" />
									<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
										<Button
											variant="destructive"
											size="icon"
											className="h-7 w-7"
											onClick={() => handleDeleteGalleryImage(gIdx)}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									</div>
								</div>
							))}
							{(!currentColor.images.gallery || currentColor.images.gallery.length === 0) && (
								<div className="col-span-full h-20 border border-dashed rounded-lg flex items-center justify-center text-xs text-muted-foreground">
									No extra gallery shots added for this color yet.
								</div>
							)}
						</div>
					</div>
				</div>

				<DialogFooter className="mt-4 pt-3 border-t">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSaveChanges}>Save Color Images</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
