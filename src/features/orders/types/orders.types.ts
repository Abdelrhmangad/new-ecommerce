export type OrderItemType = {
    nameSnapshot: {
        en: string;
        ar: string;
    };
    product: string;
    priceSnapshot: number;
    colorName: string;
    size: string;
    quantity: number;
    images: string[];
};

export type ShippingAddressType = {
    fullName: string;
    phone: string;
    city: string;
    governorate: string;
    street: string;
    building: string;
    notes: string;
};

export type OrderObjectType = {
    _id: string;
    user: string;
    items: OrderItemType[];
    shippingAddress: ShippingAddressType;
    itemsTotal: number;
    shippingFee: number;
    totalAmount: number;
    paymentProvider: string;
    paymentStatus: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};