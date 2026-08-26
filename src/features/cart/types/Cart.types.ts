export interface CartItem {
    // Unique identification for the cart line item
    variantSku: string;       // e.g., "TSHIRT-BLK-M" (Primary identifier for stock/cart actions)
    productId: string;        // e.g., product._id (Needed to navigate back to product page)

    // Display info snapshot (so cart can render without extra fetch calls)
    name: { en: string; ar: string };
    price: number;
    size: string;             // Selected size (e.g., "M")
    colorName: string;        // Selected color name (e.g., "Black")
    colorHex: string;         // Visual color swatch for the cart UI
    image: string;            // Primary image for the selected color

    // Cart state
    quantity: number;         // Amount requested by user
    maxStock: number;         // Pulled from variant.quantity (to cap quantity selector)
}