import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Link2, History, BarChart2 } from 'lucide-react';
    import ImageUploader from '@/components/features/ImageUploader';
    import UploadHistory from '@/components/features/UploadHistory';
    import UploadStats from '@/components/features/UploadStats';
    import { supabase } from '@/lib/supabaseClient';

    const HomePage = () => {
      const [sessionUploads, setSessionUploads] = useState([]);
      const [uploadStats, setUploadStats] = useState({
        totalUploadsToday: 0,
        commonFileType: '.jpeg', 
      });

      const handleUploadSuccess = (newImage) => {
        setSessionUploads(prevUploads => [newImage, ...prevUploads].slice(0, 10));
        
        setUploadStats(prevStats => ({
          ...prevStats,
          totalUploadsToday: prevStats.totalUploadsToday + 1 
        }));

        
        (async () => {
          try {
            const { error } = await supabase
              .from('uploaded_images')
              .insert([{ image_url: newImage.url, file_name: newImage.name }]);
            if (error) {
              console.error("Error saving image metadata to DB for stats:", error);
            }
          } catch (dbError) {
            console.error("Client-side error saving image metadata to DB for stats:", dbError);
          }
        })();
      };
      
      useEffect(() => {
        const fetchInitialStats = async () => {
          try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const { count, error } = await supabase
              .from('uploaded_images')
              .select('*', { count: 'exact', head: true })
              .gte('uploaded_at', today.toISOString())
              .lt('uploaded_at', tomorrow.toISOString());

            if (error) {
              console.error('Error fetching initial stats:', error);
            } else {
              setUploadStats(prevStats => ({ ...prevStats, totalUploadsToday: count || 0 }));
            }
          } catch (err) {
            console.error('Client-side error fetching initial stats:', err);
          }
        };
        fetchInitialStats();
      }, []);


      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-10 p-4 md:p-8"
        >
          <div className="text-center space-y-3">
            <motion.div 
              initial={{ opacity: 0, y: -20}}
              animate={{ opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: 0.1}}
              className="inline-block p-3 bg-gradient-to-tr from-sky-500/20 to-cyan-500/20 rounded-full mb-4 shadow-lg"
            >
              <Link2 className="h-10 w-10 text-sky-300" />
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Instant Image URL Generator
            </motion.h1>
            <p className="text-lg text-slate-300 max-w-xl mx-auto">
              Seamlessly upload your images and get shareable URLs in a flash. Your recent uploads this session are listed below.
            </p>
          </div>

          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <ImageUploader onUploadSuccess={handleUploadSuccess} />
            </div>
            <div className="lg:col-span-1 space-y-8">
              <UploadStats stats={uploadStats} />
            </div>
          </div>


          {sessionUploads.length > 0 && (
            <motion.section 
              className="w-full max-w-4xl mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <History className="h-7 w-7 text-sky-300 mr-3" />
                <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                  Your Uploads (This Session)
                </h2>
              </div>
              <UploadHistory uploads={sessionUploads} />
            </motion.section>
          )}
        </motion.div>
      );
    };

    export default HomePage;
