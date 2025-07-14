'use client';

import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Group, UserProfile } from '@/types';
import { classifyExpense } from '@/ai/flows/classify-expense';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Paperclip, Tag } from 'lucide-react';

interface AddExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group;
  members: UserProfile[];
  onExpenseAdded: (expense: any) => void;
  currentUser: UserProfile;
}

export default function AddExpenseDialog({
  isOpen,
  onOpenChange,
  group,
  members,
  onExpenseAdded,
  currentUser,
}: AddExpenseDialogProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState(currentUser.uid);
  const [category, setCategory] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const { toast } = useToast();

  const debouncedTitle = useDebounce(title, 500);
  const debouncedDescription = useDebounce(description, 500);

  useEffect(() => {
    async function classify() {
      if (!debouncedTitle && !debouncedDescription) return;
      setIsClassifying(true);
      try {
        const result = await classifyExpense({
          title: debouncedTitle,
          description: debouncedDescription,
        });
        if(result.category) {
            setCategory(result.category);
        }
      } catch (error) {
        console.error('Failed to classify expense:', error);
        toast({
            variant: "destructive",
            title: "AI Classification Failed",
            description: "Could not suggest a category for this expense.",
        });
      } finally {
        setIsClassifying(false);
      }
    }
    classify();
  }, [debouncedTitle, debouncedDescription, toast]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid positive number for the amount.',
      });
      setIsSubmitting(false);
      return;
    }

    // Mock submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    const splitAmount = numericAmount / members.length;
    const newExpense = {
        id: `exp-${Date.now()}`,
        groupId: group.id,
        title,
        description,
        amount: numericAmount,
        paidBy,
        category,
        split: members.reduce((acc, member) => ({...acc, [member.uid]: splitAmount}), {}),
        receiptUrl: receiptFile ? URL.createObjectURL(receiptFile) : undefined,
        createdAt: new Date(),
    };
    onExpenseAdded(newExpense);
    toast({
        title: "Expense Added",
        description: `${title} for $${numericAmount.toFixed(2)} has been added.`,
    })
    setIsSubmitting(false);
    onOpenChange(false);
    // Reset form
    setTitle('');
    setAmount('');
    setDescription('');
    setCategory('');
    setReceiptFile(null);
  };
  
  const paidByMember = useMemo(() => members.find(m => m.uid === paidBy), [paidBy, members]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add a New Expense</DialogTitle>
            <DialogDescription>
              Enter the details of the expense. The split will be shared equally among all members of '{group.name}'.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" placeholder="0.00" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paidBy" className="text-right">
                Paid by
              </Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select who paid">{paidByMember?.displayName}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.uid} value={member.uid}>
                      {member.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                    Category
                </Label>
                <div className="col-span-3 relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="category" value={category} onChange={e => setCategory(e.target.value)} className="pl-9" placeholder="e.g. Groceries, Rent"/>
                    {isClassifying && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />}
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" placeholder="Optional details..." />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="receipt" className="text-right">
                    Receipt
                </Label>
                <div className="col-span-3">
                    <Button asChild variant="outline" size="sm" className="w-full">
                        <label htmlFor="receipt-upload" className="cursor-pointer flex items-center gap-2">
                           <Paperclip className="h-4 w-4" />
                            {receiptFile ? receiptFile.name : "Upload an image"}
                        </label>
                    </Button>
                    <input id="receipt-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || isClassifying}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
