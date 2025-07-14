'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import {
  MOCK_USERS,
  MOCK_GROUPS,
  MOCK_EXPENSES
} from '@/data/mock';
import { calculateDebts } from '@/lib/debt';
import type { Group, Expense, UserProfile, Debt } from '@/types';
import AddExpenseDialog from './add-expense-dialog';
import { AppLogo } from './icons';
import { AlertCircle, ArrowRight, ClipboardCopy, Edit, LogOut, Plus, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(groups[0] || null);
  const [isAddExpenseOpen, setAddExpenseOpen] = useState(false);

  const groupMembers = useMemo(() => {
    if (!selectedGroup) return [];
    return MOCK_USERS.filter(u => selectedGroup.members.includes(u.uid));
  }, [selectedGroup]);

  const groupExpenses = useMemo(() => {
    if (!selectedGroup) return [];
    return expenses
      .filter(e => e.groupId === selectedGroup.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [selectedGroup, expenses]);

  const simplifiedDebts = useMemo(() => {
    if (!selectedGroup || groupExpenses.length === 0) return [];
    return calculateDebts(groupExpenses, groupMembers);
  }, [selectedGroup, groupExpenses, groupMembers]);

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  const copyInviteCode = () => {
    if (selectedGroup) {
      navigator.clipboard.writeText(selectedGroup.inviteCode);
      toast({
        title: "Invite code copied!",
        description: "Share it with your mates to join the group.",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
        <div className="flex items-center gap-3">
          <AppLogo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold">SplitMates</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent> {/* ✅ This was missing */}
        </DropdownMenu>
      </header>

      <main className="flex flex-1 flex-col md:grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col border-r bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Groups</h2>
            <Button size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" /> New
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {groups.map(group => (
              <Button
                key={group.id}
                variant={selectedGroup?.id === group.id ? 'secondary' : 'ghost'}
                className="justify-start gap-3 px-3"
                onClick={() => setSelectedGroup(group)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary-foreground">{group.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{group.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto p-4 md:p-6">
          {selectedGroup ? (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="shadow-md">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedGroup.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Users className="mr-2 h-4 w-4" /> {groupMembers.length} members
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={copyInviteCode}>
                      <ClipboardCopy className="mr-2 h-4 w-4" />
                      Copy Invite Code
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <h3 className="mb-4 text-lg font-semibold">Recent Expenses</h3>
                    <div className="space-y-4">
                      {groupExpenses.length > 0 ? groupExpenses.map(expense => {
                        const paidBy = MOCK_USERS.find(u => u.uid === expense.paidBy);
                        return (
                          <div key={expense.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={paidBy?.photoURL || ''} />
                                <AvatarFallback>{paidBy?.displayName?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{expense.title}</p>
                                <p className="text-sm text-muted-foreground">Paid by {paidBy?.displayName}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">${expense.amount.toFixed(2)}</p>
                              {expense.category && <Badge variant="outline">{expense.category}</Badge>}
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="text-center text-muted-foreground py-8">
                          <p>No expenses yet.</p>
                          <p>Click the '+' button to add the first one!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Group Members</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {groupMembers.map(member => (
                      <div key={member.uid} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.photoURL || ''} />
                          <AvatarFallback>{member.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{member.displayName}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Who Owes Who</CardTitle>
                    <CardDescription>A simplified summary of debts.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {simplifiedDebts.length > 0 ? (
                      <ul className="space-y-4">
                        {simplifiedDebts.map((debt, i) => {
                          const fromUser = MOCK_USERS.find(u => u.uid === debt.from);
                          const toUser = MOCK_USERS.find(u => u.uid === debt.to);
                          return (
                            <li key={i} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={fromUser?.photoURL || ''} />
                                  <AvatarFallback>{fromUser?.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={toUser?.photoURL || ''} />
                                  <AvatarFallback>{toUser?.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-semibold">${debt.amount.toFixed(2)}</span>
                                <Button size="sm" variant="ghost" className="h-auto p-1 text-xs text-primary hover:bg-primary/10">Settle up</Button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        <p>All settled up!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold text-foreground">Select a group</h3>
                <p>Choose a group from the list to see details, or create a new one.</p>
              </div>
            </div>
          )}
          {selectedGroup && (
            <Button
              className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl"
              size="icon"
              onClick={() => setAddExpenseOpen(true)}
            >
              <Plus className="h-8 w-8" />
              <span className="sr-only">Add Expense</span>
            </Button>
          )}
        </div>
      </main>

      {selectedGroup && (
        <AddExpenseDialog
          isOpen={isAddExpenseOpen}
          onOpenChange={setAddExpenseOpen}
          group={selectedGroup}
          members={groupMembers}
          onExpenseAdded={handleAddExpense}
          currentUser={user}
        />
      )}
    </div>
  );
}
