"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DEACTIVATE_ACCOUNT } from "@/graphql/operations/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface DeactivateAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeactivateAccountDialog({
  isOpen,
  onClose,
  onSuccess,
}: DeactivateAccountDialogProps) {
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const [deactivateAccount, { loading }] = useMutation(DEACTIVATE_ACCOUNT, {
    onCompleted: () => {
      toast({
        title: "Успешно деактивиране на акаунт",
        description: "Вашият акаунт беше деактивиран успешно. Ще бъдете пренасочени към началната страница.",
        variant: "default",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Изчакваме малко, преди да пренасочим
      setTimeout(() => {
        router.push("/");
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Грешка при деактивиране на акаунта",
        description: error.message || "Възникна неочаквана грешка. Моля, опитайте отново.",
        variant: "destructive",
      });
    }
  });

  const handleDeactivate = () => {
    deactivateAccount({
      variables: {
        input: {
          reason: reason || undefined,
          feedback: feedback || undefined,
        },
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Деактивиране на акаунт</DialogTitle>
          <DialogDescription>
            Сигурни ли сте, че искате да деактивирате акаунта си? Тази операция ще доведе до загуба на достъп до вашия акаунт.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Причина за деактивирането (по избор)
            </label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Например: Вече не използвам услугите"
              className="resize-none"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="feedback" className="text-sm font-medium">
              Обратна връзка (по избор)
            </label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Споделете вашето мнение за нас"
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отказ
          </Button>
          <Button variant="destructive" onClick={handleDeactivate} disabled={loading}>
            {loading ? "Деактивиране..." : "Деактивирай акаунта"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 