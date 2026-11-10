export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT'
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface UserMessage {
  id: string;
  text: string;
  date: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  isRead?: boolean;
}

export interface User {
  id: string;
  studentId: string;
  nationalId: string;
  email: string;
  name: string;
  role: UserRole;
  status: ApprovalStatus;
  profilePicture?: string;
  messages?: UserMessage[];
  phone?: string;
  fieldOfStudy?: string;
  semester?: string;
  degreeLevel?: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  term: string;
  field: string;
  contact?: string;
  bio?: string;
  userId?: string; // Link to user account
}

export interface Professor {
  id: string;
  name: string;
  academicRank: string;
  field: string;
  bio: string;
  image: string;
}

export interface Course {
  id: string;
  title: string;
  professorId: string;
  description?: string;
}

export enum MaterialType {
  FILE = 'FILE',
  LINK = 'LINK'
}

export interface LectureNote {
  id: string;
  title: string;
  professorId: string;
  courseId: string;
  fileUrl: string; // Base64 or URL
  type: MaterialType;
  uploaderId: string;
  status: ApprovalStatus;
  date: string;
}

export interface EducationalVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // Base64 or URL
  type: MaterialType;
  professorId: string;
  courseId: string;
  uploaderId: string;
  status: ApprovalStatus;
  date: string;
}

export enum EventCategory {
  PAST = 'PAST',
  ONGOING = 'ONGOING',
  UPCOMING = 'UPCOMING'
}

export interface AppEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time?: string;
  location?: string;
  externalLink?: string;
  image: string;
  gallery?: { url: string; description: string }[];
  requiresRegistration?: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventName: string;
  name: string;
  studentId: string;
  phone: string;
  email: string;
  socialHandles?: string;
  date: string;
}

export interface RoadmapStep {
  title: string;
  description: string;
}

export interface FieldExpert {
  id: string;
  name: string;
  role: string;
  image: string;
  description: string;
  field: string;
  userId?: string;
}

export interface DocumentArea {
  id: string;
  title: string;
  category: 'CS' | 'Math';
  description: string;
  icon: string;
  roadmap: RoadmapStep[];
  experts: FieldExpert[];
}

export interface CSField {
  id: string;
  label: string;
  subfields?: CSField[];
}

export interface NetworkingProfile {
  id: string;
  userId: string;
  name: string;
  profilePicture: string;
  fields: string[]; // List of subfield IDs
  description: string;
  email?: string;
  phone?: string;
  semester?: string;
  github?: string;
  linkedin?: string;
  status: ApprovalStatus;
  date: string;
}