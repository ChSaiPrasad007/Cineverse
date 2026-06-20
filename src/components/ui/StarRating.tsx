'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface Props {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readonly?: boolean;
}

export function StarRating({ value, onChange, size = 18, readonly = false }: Props) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => {
        const active = star <= (hover || value);
        return (
          <motion.button
            key={star}
            type="button"
            disabled={readonly}
            whileHover={readonly ? {} : { scale: 1.3 }}
            whileTap={readonly ? {} : { scale: 0.85 }}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange?.(star)}
            className="disabled:cursor-default cursor-pointer bg-transparent border-none p-0"
          >
            <motion.div animate={{ scale: active ? 1 : 0.9 }} transition={{ type: 'spring', stiffness: 400 }}>
              <Star
                size={size}
                className={active ? 'fill-white text-white' : 'fill-[#161616] text-[#161616]'}
              />
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}
