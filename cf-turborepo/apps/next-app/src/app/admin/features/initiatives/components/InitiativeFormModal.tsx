"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Initiative } from "@/types/initiative";

interface InitiativeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: z.infer<typeof formSchema>, items: any[]) => void;
  initiative?: Initiative;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

export function InitiativeFormModal({
  isOpen,
  onClose,
  onSubmit,
  initiative,
}: InitiativeFormModalProps) {
  const [items, setItems] = React.useState<any[]>([]);
  const [itemName, setItemName] = React.useState("");
  const [itemDescription, setItemDescription] = React.useState("");
  const [itemQuantity, setItemQuantity] = React.useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initiative?.title || "",
      description: initiative?.description || "",
      startDate: initiative
        ? new Date(initiative.startDate).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10),
      endDate: initiative?.endDate
        ? new Date(initiative.endDate).toISOString().substring(0, 10)
        : "",
    },
  });

  React.useEffect(() => {
    if (initiative) {
      setItems(initiative.items || []);
    } else {
      setItems([]);
    }
  }, [initiative]);

  const resetForm = () => {
    form.reset();
    setItems([]);
    setItemName("");
    setItemDescription("");
    setItemQuantity(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values, items);
    handleClose();
  };

  const addItem = () => {
    if (itemName && itemDescription && itemQuantity > 0) {
      setItems([
        ...items,
        {
          id: Date.now().toString(), // temporary ID
          name: itemName,
          description: itemDescription,
          quantity: itemQuantity,
          distributedQuantity: 0,
        },
      ]);
      setItemName("");
      setItemDescription("");
      setItemQuantity(1);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initiative ? "Edit Initiative" : "Create Initiative"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Initiative title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Initiative description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Items</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="Item name"
                    />
                  </div>
                  <div>
                    <FormLabel>Quantity</FormLabel>
                    <Input
                      type="number"
                      min="1"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    placeholder="Item description"
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  disabled={!itemName || !itemDescription || itemQuantity < 1}
                >
                  Add Item
                </Button>
              </div>

              {items.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Added Items:</h4>
                  <ul className="space-y-2">
                    {items.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center border p-2 rounded"
                      >
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.description} (Qty: {item.quantity})
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initiative ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 