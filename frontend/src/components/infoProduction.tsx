'use client';

import { useRouter } from 'next/navigation';
import { Product } from '../types/product.type';

export default function InfoProduct({ product }: { product: Product }) {

    const router = useRouter();

    const handleInfo = () => {
        console.log("🚀 ~ InfoProduct ~ product:", product)
        router.push(`shop/${product.id}`);

    };

    return (
        <button
            onClick={handleInfo}
            className="flex items-center gap-1"
        >
            Info
        </button>
    );
}