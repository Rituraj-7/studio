import { UserProfile, Group, Expense } from '@/types';

export const MOCK_USERS: UserProfile[] = [
  {
    uid: 'user-1',
    email: 'alice@example.com',
    displayName: 'Alice Johnson',
    photoURL: 'https://placehold.co/100x100.png',
  },
  {
    uid: 'user-2',
    email: 'bob@example.com',
    displayName: 'Bob Williams',
    photoURL: 'https://placehold.co/100x100.png',
  },
  {
    uid: 'user-3',
    email: 'charlie@example.com',
    displayName: 'Charlie Brown',
    photoURL: 'https://placehold.co/100x100.png',
  },
   {
    uid: 'user-4',
    email: 'diana@example.com',
    displayName: 'Diana Prince',
    photoURL: 'https://placehold.co/100x100.png',
  },
];

export const MOCK_GROUPS: Group[] = [
  {
    id: 'group-1',
    name: 'Apartment 4B',
    members: ['user-1', 'user-2', 'user-3'],
    ownerId: 'user-1',
    inviteCode: 'APT4B-2024',
  },
  {
    id: 'group-2',
    name: 'Road Trip Crew',
    members: ['user-1', 'user-2', 'user-4'],
    ownerId: 'user-2',
    inviteCode: 'TRIP-2024',
  },
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    groupId: 'group-1',
    title: 'Monthly Groceries',
    description: 'Stocked up on essentials for the month.',
    amount: 180.75,
    paidBy: 'user-1',
    split: {
      'user-1': 60.25,
      'user-2': 60.25,
      'user-3': 60.25,
    },
    category: 'Groceries',
    createdAt: new Date('2024-07-20T10:00:00Z'),
  },
  {
    id: 'exp-2',
    groupId: 'group-1',
    title: 'Internet Bill',
    description: 'High-speed fiber internet.',
    amount: 65.0,
    paidBy: 'user-2',
    split: {
      'user-1': 21.67,
      'user-2': 21.67,
      'user-3': 21.66,
    },
    category: 'Utilities',
    createdAt: new Date('2024-07-19T14:30:00Z'),
  },
   {
    id: 'exp-3',
    groupId: 'group-2',
    title: 'Gas for the trip',
    description: 'Filled up the tank before hitting the road.',
    amount: 70.40,
    paidBy: 'user-2',
    split: {
      'user-1': 23.47,
      'user-2': 23.47,
      'user-4': 23.46,
    },
    category: 'Transportation',
    createdAt: new Date('2024-07-21T09:00:00Z'),
  },
  {
    id: 'exp-4',
    groupId: 'group-1',
    title: 'Pizza Night',
    description: '',
    amount: 45.50,
    paidBy: 'user-3',
    split: {
      'user-1': 15.17,
      'user-2': 15.17,
      'user-3': 15.16,
    },
    category: 'Food',
    createdAt: new Date('2024-07-18T19:00:00Z'),
  },
];
