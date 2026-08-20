import { useQuery } from "@tanstack/react-query";
import { APPLICATION_QUERY_KEYS } from "../utils/query-keys";
import api from "../utils/axios.config";


export function useCategoryProducts({ category, page }: { category?: string, page: number }) {
    return useQuery({
        queryKey: [...APPLICATION_QUERY_KEYS.PRODUCTS, category || "", page || ''],
        queryFn: async () => {
            const res = await api.get(`/public/products`, {
                params: {
                    category: category,
                    page: page || 1
                }
            })
            return res.data
        },
    });
}