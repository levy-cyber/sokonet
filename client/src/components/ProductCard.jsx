import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiStar } from 'react-icons/fi';

const ProductCard = ({ product, onBuyNow }) => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-brand/40 transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-video overflow-hidden bg-dark-card border-b border-dark-border">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&h=400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 right-3 px-2.5 py-1 bg-dark-bg/80 backdrop-blur-md text-[10px] uppercase font-mono rounded-lg border border-dark-border/50 text-dark-muted font-bold">
          {product.category}
        </span>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-semibold text-white group-hover:text-brand transition-colors line-clamp-1">
              {product.name}
            </h4>
            <div className="flex items-center gap-1 shrink-0 text-amber-400 font-bold text-xs">
              <FiStar className="fill-current" />
              <span>{product.rating || '5.0'}</span>
            </div>
          </div>
          
          <p className="text-xs text-dark-muted mt-2 line-clamp-2 min-h-[2rem]">
            {product.description}
          </p>

          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-[10px] text-dark-muted block uppercase font-mono leading-none">Price</span>
              <span className="text-base font-bold text-white font-mono">
                {product.currency || 'KES'} {product.price.toLocaleString()}
              </span>
            </div>
            
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold border ${
              product.stock > 0 
                ? 'bg-brand/10 border-brand/20 text-brand' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-5 gap-2 mt-5">
          <Link
            to={`/marketplace/product/${product._id}`}
            className="col-span-2 text-center py-2 bg-dark-cardMuted hover:bg-dark-card border border-dark-border text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Details
          </Link>
          <button
            onClick={() => onBuyNow && onBuyNow(product)}
            disabled={product.stock <= 0}
            className="col-span-3 flex items-center justify-center gap-1.5 py-2 bg-brand hover:bg-brand-dark disabled:bg-dark-cardMuted disabled:text-dark-muted disabled:border-dark-border disabled:shadow-none text-black text-xs font-bold rounded-xl transition-all shadow-glow-green/10 hover:shadow-glow-green"
          >
            <FiShoppingBag />
            <span>Secure Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
