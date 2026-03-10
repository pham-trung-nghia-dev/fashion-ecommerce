import Image from 'next/image';
import { Product } from '../types/product.type';
import AddToCartButton from './addToCardButton';
import InfoProduct from './infoProduction';
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPriceVND } from "@/src/utils/format";


interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      {/* Image */}
      <div className="relative h-[320px] w-full bg-gradient-to-br from-rose-50 via-white to-sky-50">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent" />

        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.isNew && (
            <Badge className="rounded-full bg-rose-600 text-white">New</Badge>
          )}
          {product.discount != null && product.discount > 0 && (
            <Badge className="rounded-full bg-amber-500 text-white">
              -{product.discount}%
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <Link href={`/shop/${product.id}`} className="block">
          <h3 className="text-slate-900 text-lg font-semibold leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-slate-500 text-sm line-clamp-1">{product.subTitle}</p>
        </Link>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-slate-900 text-lg font-semibold">₫ {formatPriceVND(product.price)}</span>
            {product.oldPrice && (
              <span className="text-slate-400 line-through text-sm">₫ {formatPriceVND(product.oldPrice)}</span>
            )}
          </div>
          <span className="text-xs text-slate-500 rounded-full border border-slate-200 px-2 py-1 bg-white">
            Free returns
          </span>
        </div>
      </div>

      {/* Hover actions */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/90" />
        <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-3">
          <div className="pointer-events-auto">
            <AddToCartButton product={product} />
          </div>
          <div className="pointer-events-auto flex items-center justify-between text-slate-600 font-medium text-sm">
            <button className="hover:text-primary transition-colors">Share</button>
            <InfoProduct product={product} />
            <button className="hover:text-primary transition-colors">Like</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
