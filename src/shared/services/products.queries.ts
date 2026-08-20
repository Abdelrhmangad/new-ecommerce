import { useQuery } from "@tanstack/react-query";
import { APPLICATION_QUERY_KEYS } from "../utils/query-keys";
import api from "../utils/axios.config";


export function useCategoryProducts(selectedCategory?: string) {
    return useQuery({
        queryKey: [...APPLICATION_QUERY_KEYS.PRODUCTS, selectedCategory || ""],
        queryFn: async () => {
            const res = await api.get(`/public/products`, {
                params: {
                    category: selectedCategory
                }
            })
            return res.data
        },
        enabled: !!selectedCategory
    });
}