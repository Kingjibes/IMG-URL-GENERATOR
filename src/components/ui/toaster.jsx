import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
    CheckCircle,
    AlertTriangle,
    Info,
    CopyCheck
  } from '@/components/ui/toast';
  import { useToast } from '@/components/ui/use-toast';
  import React from 'react';
  
  const iconMap = {
    default: <Info className="mr-2 h-5 w-5" />,
    destructive: <AlertTriangle className="mr-2 h-5 w-5" />,
    success: <CheckCircle className="mr-2 h-5 w-5" />,
    copied: <CopyCheck className="mr-2 h-5 w-5" />,
  };
  
  export function Toaster() {
    const { toasts } = useToast();
  
    return (
      <ToastProvider>
        {toasts.map(({ id, title, description, action, variant, ...props }) => {
          const IconComponent = iconMap[variant] || iconMap.default;
          return (
            <Toast key={id} variant={variant} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{IconComponent}{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          );
        })}
        <ToastViewport />
      </ToastProvider>
    );
  }
