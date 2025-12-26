// ============================================
// ENUMS
// ============================================

export enum UserType {
  CLIENT = 'CLIENT',
  HOUSEKEEPER = 'HOUSEKEEPER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NEEDS_REVIEW = 'NEEDS_REVIEW',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum DisputeStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  dateOfBirth?: string;
  gender?: string;
  userType: UserType;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// ============================================
// CLIENT TYPES
// ============================================

export interface Client {
  id: string;
  userId: string;
  user?: User;
  preferences?: any;
  totalBookings: number;
  totalSpent: number;
  averageRating?: number;
  walletBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientWithUser extends Client {
  user: User;
}

// ============================================
// HOUSEKEEPER TYPES
// ============================================

export interface Housekeeper {
  id: string;
  userId: string;
  user?: User;
  bio?: string;
  yearsExperience?: number;
  hourlyRate: number;
  servicesOffered: string[];
  hasOwnSupplies: boolean;
  coverageRadiusKm: number;
  availabilitySchedule?: any;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  identityVerified: boolean;
  backgroundCheckStatus: VerificationStatus;
  backgroundCheckDate?: string;
  totalServices: number;
  totalEarned: number;
  averageRating?: number;
  totalReviews: number;
  acceptanceRate?: number;
  completionRate?: number;
  cancellationRate?: number;
  isAvailable: boolean;
  currentlyServing: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HousekeeperWithUser extends Housekeeper {
  user: User;
}

// ============================================
// ADDRESS TYPES
// ============================================

export interface Address {
  id: string;
  userId: string;
  label?: string;
  streetAddress: string;
  apartmentNumber?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  additionalInstructions?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// BOOKING TYPES
// ============================================

export interface Booking {
  id: string;
  bookingCode: string;
  clientId: string;
  client?: Client;
  housekeeperId: string;
  housekeeper?: Housekeeper;
  addressId: string;
  address?: Address;
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  estimatedDurationMinutes: number;
  actualStartTime?: string;
  actualEndTime?: string;
  actualDurationMinutes?: number;
  servicesRequested: string[];
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  hasPets: boolean;
  clientNotes?: string;
  basePrice: number;
  extraServicesPrice: number;
  extraTimePrice: number;
  subtotal: number;
  serviceFee: number;
  tax: number;
  tip: number;
  totalPrice: number;
  status: BookingStatus;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

export interface BookingWithRelations extends Booking {
  client: ClientWithUser;
  housekeeper: HousekeeperWithUser;
  address: Address;
}

// ============================================
// PAYMENT TYPES
// ============================================

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  paymentProvider?: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  status: PaymentStatus;
  cardLast4?: string;
  cardBrand?: string;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: string;
  createdAt: string;
  processedAt?: string;
}

// ============================================
// VERIFICATION TYPES
// ============================================

export interface Verification {
  id: string;
  housekeeperId: string;
  identityStatus: VerificationStatus;
  identityProvider?: string;
  identityVerifiedAt?: string;
  identityExpiresAt?: string;
  documentType?: string;
  documentNumber?: string;
  documentCountry?: string;
  documentExpiry?: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  phoneVerified: boolean;
  phoneVerifiedAt?: string;
  backgroundCheckStatus: VerificationStatus;
  backgroundCheckProvider?: string;
  backgroundCheckCompletedAt?: string;
  backgroundCheckExpiresAt?: string;
  backgroundCheckResult?: any;
  referencesStatus: VerificationStatus;
  referencesCount: number;
  referencesData?: any;
  interviewStatus: VerificationStatus;
  interviewDate?: string;
  interviewNotes?: string;
  interviewRating?: number;
  verificationLevel?: string;
  needsReverification: boolean;
  lastVerifiedAt?: string;
  nextVerificationDue?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TRUST SCORE TYPES
// ============================================

export interface TrustScore {
  id: string;
  userId?: string;
  clientId?: string;
  housekeeperId?: string;
  score: number;
  verificationScore: number;
  behavioralScore: number;
  transactionScore: number;
  reviewScore: number;
  scoreHistory?: any;
  riskLevel: RiskLevel;
  isFlagged: boolean;
  flagReasons: string[];
  lastCalculatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// DISPUTE TYPES
// ============================================

export interface Dispute {
  id: string;
  bookingId: string;
  booking?: Booking;
  initiatedBy: string;
  against: string;
  category: string;
  description: string;
  evidence?: any;
  status: DisputeStatus;
  resolution?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// ============================================
// REVIEW TYPES
// ============================================

export interface Review {
  id: string;
  bookingId: string;
  clientToHousekeeperRating?: number;
  clientToHousekeeperReview?: string;
  clientReviewAspects?: any;
  housekeeperToClientRating?: number;
  housekeeperComments?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// ============================================
// DASHBOARD STATS
// ============================================

export interface DashboardStats {
  totalClients: number;
  totalHousekeepers: number;
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  pendingVerifications: number;
  openDisputes: number;
  newUsersThisMonth: number;
  revenueThisMonth: number;
  bookingsThisMonth: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// AUTH TYPES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
