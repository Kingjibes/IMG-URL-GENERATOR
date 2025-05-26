import React, { useState } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Copy, Check, FileText, ExternalLink } from 'lucide-react';

    const UploadHistoryItem = ({ upload, onCopy }) => {
      const [copied, setCopied] = useState(false);

      const handleCopy = () => {
        navigator.clipboard.writeText(upload.url);
        setCopied(true);
        onCopy(upload.url);
        setTimeout(() => setCopied(false), 2000);
      };

      return (
        <motion.div
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="flex items-center justify-between p-3 bg-slate-700/50 hover:bg-slate-700/80 rounded-lg border border-slate-600/70 transition-colors duration-200"
        >
          <div className="flex items-center overflow-hidden mr-2">
            <FileText className="h-5 w-5 text-sky-400 mr-3 flex-shrink-0" />
            <span className="text-sm text-slate-200 truncate" title={upload.name}>
              {upload.name}
            </span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(upload.url, '_blank')}
              className="text-slate-400 hover:text-sky-300"
              aria-label="Open image in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCopy}
              className="text-slate-400 hover:text-sky-300"
              aria-label="Copy URL"
            >
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
      );
    };

    const UploadHistory = ({ uploads }) => {
      const { toast } = useToast();

      if (!uploads || uploads.length === 0) {
        return (
          <div className="text-center py-8 text-slate-400 bg-slate-800/30 rounded-lg border border-dashed border-slate-700">
            <p className="text-sm">No images uploaded in this session yet.</p>
            <p className="text-xs mt-1">Your uploads will appear here.</p>
          </div>
        );
      }

      const handleItemCopy = (url) => {
        toast({
          title: "URL Copied!",
          description: "Image link copied to your clipboard.",
          variant: "copied",
        });
      };

      return (
        <div className="space-y-3 p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/60 max-h-[400px] overflow-y-auto custom-scrollbar">
          <AnimatePresence initial={false}>
            {uploads.map((upload) => (
              <UploadHistoryItem key={upload.id || upload.timestamp} upload={upload} onCopy={handleItemCopy} />
            ))}
          </AnimatePresence>
        </div>
      );
    };

    export default UploadHistory;
