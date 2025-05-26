import React from 'react';
    import { motion } from 'framer-motion';
    import { ExternalLink } from 'lucide-react';

    const RecentUploadsGallery = ({ images }) => {
      if (!images || images.length === 0) {
        return (
          <div className="text-center py-10 text-slate-400">
            <p>No recent uploads yet. Be the first!</p>
          </div>
        );
      }

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { type: 'spring', stiffness: 100, damping: 12 }
        },
      };

      return (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {images.map((image) => (
            <motion.div
              key={image.id || image.image_url}
              className="group relative aspect-square bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700/50"
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0, 255, 255, 0.15)" }}
            >
              <img  
                src={image.image_url} 
                alt={image.file_name || 'Recently uploaded image'} 
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
               src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a
                  href={image.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 p-2 bg-sky-500/80 hover:bg-sky-500 rounded-full text-white transition-all transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-300 delay-100"
                  aria-label="View full image"
                >
                  <ExternalLink size={18} />
                </a>
                {image.file_name && (
                   <p className="absolute bottom-3 left-3 text-xs text-slate-200 p-1 bg-black/50 rounded backdrop-blur-sm truncate max-w-[calc(100%-4rem)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    {image.file_name}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    };

    export default RecentUploadsGallery;
