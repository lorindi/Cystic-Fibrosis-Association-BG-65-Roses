"use client";

import { useMutation } from "@apollo/client";
import { REACTIVATE_ACCOUNT } from "@/graphql/operations/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/graphql/generated/graphql";

interface ReactivateAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: Pick<User, '_id' | 'name' | 'email'>;
  onSuccess?: () => void;
}

export function ReactivateAccountDialog({
  isOpen,
  onClose,
  user,
  onSuccess,
}: ReactivateAccountDialogProps) {
  const { toast } = useToast();

  const [reactivateAccount, { loading }] = useMutation(REACTIVATE_ACCOUNT, {
    onCompleted: () => {
      toast({
        title: "Успешно реактивиране на акаунт",
        description: `Акаунтът на ${user.name} беше успешно реактивиран.`,
        variant: "default",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Грешка при реактивиране на акаунта",
        description: error.message || "Възникна неочаквана грешка. Моля, опитайте отново.",
        variant: "destructive",
      });
    }
  });

  const handleReactivate = () => {
    reactivateAccount({
      variables: {
        userId: user._id,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Реактивиране на акаунт</DialogTitle>
          <DialogDescription>
            Сигурни ли сте, че искате да реактивирате този акаунт? Потребителят ще получи отново достъп до платформата.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Потребител:</p>
            <p className="text-sm">{user.name} ({user.email})</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отказ
          </Button>
          <Button onClick={handleReactivate} disabled={loading}>
            {loading ? "Реактивиране..." : "Реактивирай акаунта"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 