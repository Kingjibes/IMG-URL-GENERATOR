import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { BarChart2, FileType2, Zap, Lightbulb } from 'lucide-react';

    const funFacts = [
      "The first digital photograph was taken in 1957.",
      "JPEG stands for Joint Photographic Experts Group.",
      "PNG format supports lossless compression and transparency.",
      "The color red is often used in branding to evoke excitement.",
      "Blue is the most popular favorite color worldwide.",
      "The human eye can distinguish about 10 million different colors.",
      "GIFs were introduced in 1987 and support animations."
    ];

    const StatCard = ({ icon, title, value, colorClass, unit }) => (
      <motion.div 
        className="flex items-center p-4 bg-slate-700/60 rounded-lg border border-slate-600/80 shadow-md"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`p-2 rounded-full mr-3 ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-300">{title}</p>
          <p className="text-lg font-semibold text-slate-100">
            {value} <span className="text-xs text-slate-400">{unit}</span>
          </p>
        </div>
      </motion.div>
    );

    const UploadStats = ({ stats }) => {
      const [currentFactIndex, setCurrentFactIndex] = useState(0);

      useEffect(() => {
        const timer = setInterval(() => {
          setCurrentFactIndex((prevIndex) => (prevIndex + 1) % funFacts.length);
        }, 7000); 
        return () => clearInterval(timer);
      }, []);

      return (
        <motion.div 
          className="p-6 bg-slate-800/60 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700/80 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center text-xl font-semibold text-slate-100 mb-1">
            <BarChart2 className="mr-2 h-6 w-6 text-emerald-400" />
            Site Stats & Facts
          </div>
          
          <StatCard 
            icon={<Zap className="h-5 w-5 text-white" />} 
            title="Uploads Today" 
            value={stats.totalUploadsToday}
            colorClass="bg-emerald-500"
            unit="images"
          />
          <StatCard 
            icon={<FileType2 className="h-5 w-5 text-white" />} 
            title="Common Format" 
            value={stats.commonFileType}
            colorClass="bg-sky-500"
          />

          <motion.div 
            className="p-4 bg-slate-700/40 rounded-lg border border-slate-600/50"
            key={currentFactIndex} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-2">
              <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-sm font-medium text-yellow-300">Fun Fact:</p>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {funFacts[currentFactIndex]}
            </p>
          </motion.div>
        </motion.div>
      );
    };

    export default UploadStats;
