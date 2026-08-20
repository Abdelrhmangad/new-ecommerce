import { useQuery } from "@tanstack/react-query";
import { APPLICATION_QUERY_KEYS } from "../utils/query-keys";
import api from "../utils/axios.config";


export function useProductsCategories() {
    return useQuery({
        queryKey: APPLICATION_QUERY_KEYS.CATEGORIES,
        queryFn: async () => {
            const res = await api.get('/public/categories')
            console.log("/public/categories RES", res)
            return res.data
        },
    });
}