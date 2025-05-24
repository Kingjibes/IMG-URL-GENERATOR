import React, { useState, useCallback } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useToast } from '@/components/ui/use-toast';
    import { UploadCloud, Copy, Check, FileCheck2, ImagePlus, Link2 } from 'lucide-react';
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
            toast({
              title: "File Ready",
              description: `File "${file.name}" selected and ready for upload.`,
              variant: "success", 
            });
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
          const randomString = Math.random().toString(36).substring(2, 8); // 6 char random string
          const fileName = `${randomString}_${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from(IMAGE_BUCKET_NAME)
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: false, 
            });

          if (uploadError) {
            if (uploadError.message.includes('Bucket not found')) {
                 toast({
                    title: "Upload Failed: Bucket Issue",
                    description: "The bucket 'imgurl' was found, but policies might prevent uploads. Check Supabase Storage policies.",
                    variant: "destructive",
                    duration: 9000, 
                  });
            } else {
                throw uploadError;
            }
            setIsLoading(false);
            return; 
          }

          const { data: publicUrlData } = supabase.storage
            .from(IMAGE_BUCKET_NAME)
            .getPublicUrl(filePath);

          if (!publicUrlData || !publicUrlData.publicUrl) {
            throw new Error("Could not retrieve public URL. Check bucket read policies.");
          }
          
          let displayUrl = publicUrlData.publicUrl;
          setImageUrl(displayUrl);
          
          navigator.clipboard.writeText(displayUrl)
            .then(() => {
              setCopied(true);
              toast({
                title: "Image Live & Copied!",
                description: "URL generated and copied to clipboard.",
                variant: "success" 
              });
              setTimeout(() => setCopied(false), 3000);
            })
            .catch(() => {
              toast({ 
                title: "Image Live!", 
                description: "URL generated. Manual copy failed.",
                variant: "success"
              });
            });


        } catch (error) {
          console.error("Upload error:", error);
          toast({
            title: "Upload Failed",
            description: error.message || "Error uploading image. Check 'imgurl' bucket policies.",
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
              toast({ 
                title: "URL Copied!", 
                description: "Link copied to your clipboard.",
                variant: "copied" 
              });
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
            <motion.div 
              initial={{ opacity: 0, y: -20}}
              animate={{ opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: 0.1}}
              className="inline-block p-3 bg-gradient-to-tr from-sky-500/20 to-cyan-500/20 rounded-full mb-4"
            >
              <Link2 className="h-10 w-10 text-sky-300" />
            </motion.div>
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
            className="w-full max-w-lg p-6 md:p-8 bg-slate-800/60 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700/80 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="space-y-3">
              <label 
                htmlFor="file-upload" 
                className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-semibold rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-sky-500/30 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-sky-400"
              >
                <ImagePlus className="mr-2 h-5 w-5" />
                Choose an Image
              </label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" 
              />
              {selectedFile && !isLoading && !imageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center text-sm text-green-300 bg-green-500/20 p-3 rounded-md border border-green-500/50"
                >
                  <FileCheck2 className="h-5 w-5 mr-2 text-green-400" />
                  <span>File "{selectedFile.name}" ready for upload.</span>
                </motion.div>
              )}
            </div>
            
            <Button 
              onClick={handleUpload} 
              disabled={isLoading || !selectedFile}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-emerald-500/30"
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
                className="mt-6 space-y-3 p-4 bg-slate-700/70 rounded-lg border border-slate-600/80 shadow-inner"
              >
                <p className="text-sm font-medium text-slate-100">Your Image URL is Ready:</p>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="text" 
                    value={imageUrl} 
                    readOnly 
                    className="flex-grow bg-slate-800 border-slate-600 text-slate-200 focus:ring-sky-500 selection:bg-sky-500 selection:text-white"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleCopyToClipboard}
                    className="border-slate-500 bg-slate-600/50 hover:bg-slate-500/70 text-slate-300 hover:text-sky-300 transition-colors"
                    aria-label="Copy URL to clipboard"
                  >
                    {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      );
    };

    export default HomePage;
