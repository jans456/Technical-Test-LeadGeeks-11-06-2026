export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface Ticket {
  id: number;
  title: string;
  requester_name: string | null;
  category: string;
  priority: Priority;
  status: Status;
  assigned_person: string;
  created_at: string;
  updated_at: string;
}

export interface Stats {
  total: number;
  open: number;
  in_progress: number;
  high_priority: number;
}

export type TicketFormData = Omit<Ticket, 'id' | 'created_at' | 'updated_at'>;
