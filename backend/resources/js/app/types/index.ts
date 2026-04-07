export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'worker' | 'employer' | 'landlord';
  status: 'active' | 'inactive' | 'banned';
  credit_score: number;
  avatar?: string;
  created_at?: string;
}

export interface WorkerSkill {
  id: number;
  worker_id: number;
  skill_name: string;
  experience_years: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface WorkerProfile {
  id: number;
  user_id: number;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  id_card_number: string;
  id_card_verified: boolean;
  bio?: string;
  availability: 'available' | 'busy' | 'unavailable';
  skills: WorkerSkill[];
  user?: User;
}

export interface Employer {
  id: number;
  user_id: number;
  company_name: string;
  industry: string;
  verified: boolean;
  company_size: string;
  company_address?: string;
  tax_code?: string;
  logo?: string;
  user?: User;
}

export interface JobPost {
  id: number;
  employer_id: number;
  title: string;
  description: string;
  job_type: string;
  positions_count: number;
  filled_count: number;
  salary_type: 'hourly' | 'daily' | 'shift' | 'monthly';
  salary_amount: number;
  shift_type: 'morning' | 'afternoon' | 'evening' | 'night' | 'flexible';
  work_start_date: string;
  work_end_date: string;
  work_address: string;
  has_housing: boolean;
  status: 'draft' | 'active' | 'paused' | 'closed';
  view_count: number;
  created_at: string;
  employer?: Employer;
  requirements?: string;
  benefits?: string;
}

export interface Application {
  id: number;
  job_post_id: number;
  worker_id: number;
  status: 'new' | 'reviewing' | 'interview_invited' | 'interviewed' | 'passed' | 'rejected' | 'hired' | 'withdrawn';
  match_score?: number;
  note?: string;
  applied_at: string;
  updated_at: string;
  worker?: {
    id: number;
    name: string;
    phone: string;
    avatar?: string;
  };
  job_post?: JobPost;
}

export interface Room {
  id: number;
  dormitory_id: number;
  room_number: string;
  room_type: 'single' | 'double' | 'quad' | 'dorm';
  capacity: number;
  current_occupancy: number;
  price_per_month: number;
  status: 'available' | 'full' | 'maintenance';
}

export interface Dormitory {
  id: number;
  name: string;
  address: string;
  total_rooms: number;
  available_rooms: number;
  price_range_min: number;
  price_range_max: number;
  rating: number;
  has_wifi: boolean;
  has_ac: boolean;
  has_parking: boolean;
  has_security: boolean;
  rules?: string;
  rooms?: Room[];
  landlord?: User;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_workers: number;
  total_employers: number;
  total_job_posts: number;
  total_applications: number;
  workers_trend: number;
  employers_trend: number;
  job_posts_trend: number;
  applications_trend: number;
}
