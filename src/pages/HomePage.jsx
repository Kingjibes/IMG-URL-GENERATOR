import React, { useState, useCallback } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useToast } from '@/components/ui/use-toast';
    import { UploadCloud, Copy, Check } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { supabase } from '@/lib/supabaseClient';

    const IMAGE_BUCKET_NAME = 'imgurl';

    const HomePage = () => {
      const [selectedFile, setSelectedFile] = useState(null);
      const [imageUrl, setImageUrl] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [copied, setCopied] = useState(false);
      const { toast } = useToast();

      const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          if (file.type.startsWith('image/')) {
            setSelectedFile(file);
            setImageUrl('');
            setCopied(false);
          } else {
            toast({
              title: "Invalid File Type",
              description: "Please upload an image file (e.g., JPG, PNG, GIF).",
              variant: "destructive",
            });
            setSelectedFile(null);
          }
        }
      };

      const handleUpload = useCallback(async () => {
        if (!selectedFile) {
          toast({
            title: "No File Selected",
            description: "Please select an image file to upload.",
            variant: "destructive",
          });
          return;
        }

        setIsLoading(true);

        try {
          const fileExt = selectedFile.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from(IMAGE_BUCKET_NAME)
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: false, 
            });

          if (uploadError) {
            // Check if the error is specifically about the bucket not being found,
            // which might indicate a policy issue despite the bucket existing.
            if (uploadError.message.includes('Bucket not found')) {
                 toast({
                    title: "Upload Failed: Bucket Issue",
                    description: "The bucket 'imgurl' was found, but there might be a policy preventing uploads. Please check your Supabase Storage policies to ensure 'insert' operations are allowed for public/anon users.",
                    variant: "destructive",
                    duration: 9000, 
                  });
            } else {
                throw uploadError;
            }
            return; 
          }

          const { data: publicUrlData } = supabase.storage
            .from(IMAGE_BUCKET_NAME)
            .getPublicUrl(filePath);

          if (!publicUrlData || !publicUrlData.publicUrl) {
            throw new Error("Could not retrieve public URL. Check bucket read policies.");
          }
          
          let displayUrl = publicUrlData.publicUrl;
          // The requirement to always have a .jpeg extension even if the uploaded file is different
          // (e.g. png) is best handled by a server-side image conversion process.
          // Supabase Storage URLs will reflect the actual stored file type.
          // For this client-side implementation, we will keep the actual Supabase URL.
          // If you need a specific .jpeg extension for all URLs regardless of input type,
          // you would typically implement a Supabase Edge Function to handle image conversion
          // and then return the URL to that converted .jpeg image.
          // For now, we remove the forced .jpeg extension to reflect the true URL.
          // if (!displayUrl.toLowerCase().endsWith('.jpeg')) {
          //    const urlParts = displayUrl.split('.');
          //    urlParts.pop(); 
          //    displayUrl = urlParts.join('.') + '.jpeg'; 
          // }


          setImageUrl(displayUrl);
          toast({
            title: "Upload Successful!",
            description: "Your image URL has been generated.",
          });

        } catch (error) {
          console.error("Upload error:", error);
          toast({
            title: "Upload Failed",
            description: error.message || "There was an error uploading your image. Please ensure the bucket 'imgurl' exists and has correct public access policies in Supabase.",
            variant: "destructive",
            duration: 9000,
          });
        } finally {
          setIsLoading(false);
        }
      }, [selectedFile, toast]);

      const handleCopyToClipboard = () => {
        if (imageUrl) {
          navigator.clipboard.writeText(imageUrl)
            .then(() => {
              setCopied(true);
              toast({ title: "Copied!", description: "URL copied to clipboard." });
              setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {
              toast({ title: "Copy Failed", description: "Could not copy URL.", variant: "destructive" });
            });
        }
      };
      

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-8 p-4 md:p-8"
        >
          <div className="text-center space-y-2">
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Image URL Generator
            </motion.h1>
            <p className="text-lg text-slate-300">
              Easily upload your images and get shareable URLs.
            </p>
          </div>

          <motion.div 
            className="w-full max-w-lg p-6 md:p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="space-y-2">
              <label htmlFor="file-upload" className="block text-sm font-medium text-slate-200">
                Choose an image
              </label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-500 file:text-sky-50 hover:file:bg-sky-600 transition-colors cursor-pointer focus-visible:ring-sky-500"
              />
              {selectedFile && <p className="text-sm text-slate-400 mt-1">Selected: {selectedFile.name}</p>}
            </div>
            
            <Button 
              onClick={handleUpload} 
              disabled={isLoading || !selectedFile}
              className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3 text-base disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2 h-5 w-5"
                  >
                    <UploadCloud />
                  </motion.div>
                  Generating URL...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-5 w-5" />
                  Generate URL
                </>
              )}
            </Button>

            {imageUrl && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600"
              >
                <p className="text-sm font-medium text-slate-200">Generated URL:</p>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="text" 
                    value={imageUrl} 
                    readOnly 
                    className="flex-grow bg-slate-800 border-slate-600 text-slate-50 focus:ring-sky-500"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleCopyToClipboard}
                    className="border-slate-600 hover:bg-slate-600 text-slate-300 hover:text-sky-300"
                  >
                    {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
              </motion.div>
            )}

            {selectedFile && !imageUrl && !isLoading && (
               <div className="mt-4 p-4 border border-dashed border-slate-600 rounded-lg">
                 <img 
                   alt={selectedFile.name || "Uploaded image preview"}
                   className="max-w-full max-h-60 mx-auto rounded-md shadow-md"
                  src="https://images.unsplash.com/photo-1697256200022-f61abccad430" />
               </div>
            )}
          </motion.div>
        </motion.div>
      );
    };

    export default HomePage;