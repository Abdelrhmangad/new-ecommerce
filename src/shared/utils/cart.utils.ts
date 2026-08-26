import toast from "react-hot-toast";
import { CartItem } from "../../features/cart/types/Cart.types";
import { ProductPropType } from "../../features/products/types/Product.types";
import useStore from "@/store/store";

type CombinedType = ProductPropType & { selectedSku: string; quantity: number; selectedColorHex: string };

export function addPdtToCart(pdtData: CombinedType, t: (key: string, values?: Record<string, string>) => string) {
    void t;

    // Find stock data for the selected variant
    const pdtVariantData = pdtData.variants.find(variant => variant.sku === pdtData.selectedSku);
    const availableStock = pdtVariantData?.quantity ?? 0;

    const existingItem = useStore.getState().cart.items.find(
        (item) => item.variantSku === pdtData.selectedSku,
    );
    const currentCartQuantity = existingItem ? existingItem.quantity : 0;
    const requestedTotal = currentCartQuantity + pdtData.quantity;

    // Check if total requested quantity exceeds stock limit
    if (requestedTotal > availableStock) {
        const remainingAllowed = availableStock - currentCartQuantity;

        if (remainingAllowed <= 0) {
            toast.error("You have already reached the maximum available stock for this item in your cart.");
        } else {
            toast.error(`Cannot add ${pdtData.quantity} item(s). Only ${remainingAllowed} more available.`);
        }
        return; // Stop execution
    }

    const pdtColorObj = pdtData.colors.find(color => color.hex === pdtData?.selectedColorHex);
    const primaryImg = pdtColorObj?.images?.primary || pdtColorObj?.images?.secondary;

    const newItem: CartItem = {
        variantSku: pdtData.selectedSku,
        productId: pdtData._id ?? pdtData.id,
        name: pdtData.name,
        price: pdtData.price,
        size: pdtVariantData?.size || '',
        colorName: pdtVariantData?.colorName || "",
        colorHex: pdtData.selectedColorHex,
        image: primaryImg || "",
        quantity: pdtData.quantity,
        maxStock: availableStock,
    };

    useStore.getState().addToCart(newItem);
    toast.success("Added to cart successfully!");
}