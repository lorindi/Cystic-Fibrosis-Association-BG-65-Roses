'use client';

import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Shield, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionName?: string;
}

export function AccessDeniedModal({
  isOpen,
  onClose,
  sectionName = 'this section'
}: AccessDeniedModalProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
    onClose();
  };

  const handleGoToDashboard = () => {
    router.push('/admin');
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-2">
            <div className="bg-red-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <AlertDialogTitle className="text-center">Access Denied</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            <p className="mb-2">
              You don't have the necessary permissions to access {sectionName}.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start mt-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Access to this section is restricted to administrators or users with specific permissions. 
                Please contact an administrator if you need access.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center space-x-2">
          <AlertDialogAction 
            onClick={handleGoBack}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            Go Back
          </AlertDialogAction>
          <AlertDialogAction 
            onClick={handleGoToDashboard}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Go to Dashboard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 