import { useQuery } from "@tanstack/react-query";
import { APPLICATION_QUERY_KEYS } from "../utils/query-keys";
import api from "../utils/axios.config";


export function useProducts({ categories, page, size }: { categories?: string, page?: number, size?: string }) {
    return useQuery({
        queryKey: [...APPLICATION_QUERY_KEYS.PRODUCTS, categories || "", page || '', size || ""],
        queryFn: async () => {
            const res = await api.get(`/public/products`, {
                params: {
                    categories: categories,
                    page: page || 1,
                    size: size
                }
            })
            return res.data
        },
    });
}