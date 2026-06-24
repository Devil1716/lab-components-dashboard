export interface Semester {
  id?: string;
  name: string;
  academic_year: string;
  start_date: string; // ISO string
  end_date: string; // ISO string
  timetable_image_path?: string;
  is_active: boolean;
  created_at: string;
}

export interface Lab {
  id?: string;
  lab_name: string;
  description?: string;
  semester_id: string;
}

export interface LabSession {
  id?: string;
  semester_id: string;
  lab_id: string;
  session_date: string;
  time_slot: string;
  faculty_name: string;
  session_code?: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Batch {
  id?: string;
  semester_id: string;
  lab_id: string;
  batch_name: string;
  max_students: number; // Max 3
  status: 'active' | 'inactive';
}

export interface Student {
  id?: string;
  batch_id: string;
  name: string;
  sen: string;
  created_at: string;
}

export interface Component {
  id?: string;
  component_name: string;
  category?: string;
  description?: string;
  unit_price: number;
  total_quantity: number;
  available_quantity: number;
  damaged_quantity: number;
  under_review_quantity: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface IssueTransaction {
  id?: string;
  semester_id: string;
  lab_id: string;
  session_id: string;
  batch_id: string;
  issued_by: string; // Admin User ID
  issued_at: string;
  acknowledged_by?: string; // Student ID
  issue_status: 'pending_acknowledgment' | 'acknowledged';
  return_status: 'pending' | 'partially_returned' | 'returned';
}

export interface IssueTransactionItem {
  id?: string;
  transaction_id: string;
  component_id: string;
  quantity_issued: number;
  quantity_returned: number;
  quantity_damaged: number;
  quantity_missing: number;
  item_status: 'issued' | 'returned_properly' | 'under_review' | 'damaged' | 'missing';
  remarks?: string;
}

export interface Fine {
  id?: string;
  batch_id: string;
  transaction_id: string;
  component_id: string;
  quantity: number;
  amount: number;
  reason: string;
  fine_status: 'pending' | 'paid' | 'waived';
  created_at: string;
}

export interface AuditLog {
  id?: string;
  user_id: string; // Admin or System
  action: string;
  module: string;
  entity_id: string;
  entity_type: string;
  description: string;
  created_at: string;
}
