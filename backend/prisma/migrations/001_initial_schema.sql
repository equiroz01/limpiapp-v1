-- LimpiApp - Initial Database Schema
-- PostgreSQL 15+
-- Date: 2024-12-04

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_type AS ENUM ('CLIENT', 'HOUSEKEEPER', 'ADMIN');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED', 'PENDING_VERIFICATION');
CREATE TYPE verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVIEW');
CREATE TYPE booking_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'IN_PROGRESS', 'COMPLETED', 'DISPUTED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');
CREATE TYPE dispute_status AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED');
CREATE TYPE risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_photo VARCHAR(500),
    date_of_birth DATE,
    gender VARCHAR(20),
    user_type user_type NOT NULL,
    status user_status DEFAULT 'PENDING_VERIFICATION' NOT NULL,

    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_status ON users(status);

-- ============================================
-- CLIENTS TABLE
-- ============================================

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    preferences JSONB,
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    average_rating DECIMAL(3,2),
    wallet_balance DECIMAL(10,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clients_user_id ON clients(user_id);

-- ============================================
-- HOUSEKEEPERS TABLE
-- ============================================

CREATE TABLE housekeepers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    bio TEXT,
    years_experience INTEGER,
    hourly_rate DECIMAL(8,2) NOT NULL,
    services_offered TEXT[],
    has_own_supplies BOOLEAN DEFAULT FALSE,
    coverage_radius_km INTEGER DEFAULT 10,
    availability_schedule JSONB,

    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status verification_status DEFAULT 'PENDING',
    identity_verified BOOLEAN DEFAULT FALSE,
    background_check_status verification_status DEFAULT 'PENDING',
    background_check_date DATE,

    -- Statistics
    total_services INTEGER DEFAULT 0,
    total_earned DECIMAL(10,2) DEFAULT 0,
    average_rating DECIMAL(3,2),
    total_reviews INTEGER DEFAULT 0,
    acceptance_rate DECIMAL(5,2),
    completion_rate DECIMAL(5,2),
    cancellation_rate DECIMAL(5,2),

    -- Current status
    is_available BOOLEAN DEFAULT FALSE,
    currently_serving BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_housekeepers_user_id ON housekeepers(user_id);
CREATE INDEX idx_housekeepers_available ON housekeepers(is_available, verification_status);
CREATE INDEX idx_housekeepers_rating ON housekeepers(average_rating);

-- ============================================
-- ADDRESSES TABLE
-- ============================================

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    label VARCHAR(50),
    street_address VARCHAR(255) NOT NULL,
    apartment_number VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'MX',
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    additional_instructions TEXT,
    is_default BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_location ON addresses(latitude, longitude);

-- ============================================
-- BOOKINGS TABLE
-- ============================================

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(20) UNIQUE NOT NULL,

    -- Participants
    client_id UUID NOT NULL REFERENCES clients(id),
    housekeeper_id UUID NOT NULL REFERENCES housekeepers(id),
    address_id UUID NOT NULL REFERENCES addresses(id),

    -- Timing
    scheduled_date DATE NOT NULL,
    scheduled_start_time TIMESTAMP NOT NULL,
    scheduled_end_time TIMESTAMP NOT NULL,
    estimated_duration_minutes INTEGER NOT NULL,

    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    actual_duration_minutes INTEGER,

    -- Services
    services_requested TEXT[] NOT NULL,
    home_size VARCHAR(20),
    has_pets BOOLEAN DEFAULT FALSE,
    special_instructions TEXT,

    -- Pricing
    base_price DECIMAL(8,2) NOT NULL,
    extra_services_price DECIMAL(8,2) DEFAULT 0,
    extra_time_price DECIMAL(8,2) DEFAULT 0,
    subtotal DECIMAL(8,2) NOT NULL,
    service_fee DECIMAL(8,2) NOT NULL,
    tax DECIMAL(8,2) NOT NULL,
    tip DECIMAL(8,2) DEFAULT 0,
    total_price DECIMAL(8,2) NOT NULL,

    -- Status
    status booking_status DEFAULT 'PENDING' NOT NULL,
    cancellation_reason TEXT,
    cancelled_by VARCHAR(20),
    cancelled_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    accepted_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_housekeeper_id ON bookings(housekeeper_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX idx_bookings_booking_code ON bookings(booking_code);

-- ============================================
-- PAYMENTS TABLE
-- ============================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id),

    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'MXN',

    payment_method VARCHAR(50),
    payment_provider VARCHAR(50),

    -- Stripe IDs
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),

    status payment_status DEFAULT 'PENDING',

    card_last4 VARCHAR(4),
    card_brand VARCHAR(20),

    refund_amount DECIMAL(10,2),
    refund_reason TEXT,
    refunded_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- PAYMENT METHODS TABLE
-- ============================================

CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

    stripe_payment_method_id VARCHAR(255) UNIQUE NOT NULL,
    card_brand VARCHAR(50) NOT NULL,
    card_last4 VARCHAR(4) NOT NULL,
    card_exp_month INTEGER NOT NULL,
    card_exp_year INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_client_id ON payment_methods(client_id);

-- ============================================
-- REVIEWS TABLE
-- ============================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id),
    user_id UUID NOT NULL REFERENCES users(id),

    -- Client reviews Housekeeper (public)
    client_to_housekeeper_rating INTEGER CHECK (client_to_housekeeper_rating BETWEEN 1 AND 5),
    client_to_housekeeper_review TEXT,
    client_review_aspects JSONB,

    -- Housekeeper reviews Client (private)
    housekeeper_to_client_rating INTEGER CHECK (housekeeper_to_client_rating BETWEEN 1 AND 5),
    housekeeper_comments TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- ============================================
-- VERIFICATIONS TABLE
-- ============================================

CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    housekeeper_id UUID UNIQUE NOT NULL REFERENCES housekeepers(id) ON DELETE CASCADE,

    -- Identity
    identity_status verification_status DEFAULT 'PENDING',
    identity_provider VARCHAR(50),
    identity_session_id VARCHAR(255),
    identity_verified_at TIMESTAMP,
    identity_expires_at TIMESTAMP,

    -- Documents
    document_type VARCHAR(50),
    document_number VARCHAR(100),
    document_country VARCHAR(2),
    document_expiry DATE,

    -- Email & Phone
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_verified_at TIMESTAMP,

    -- Background check
    background_check_status verification_status DEFAULT 'PENDING',
    background_check_provider VARCHAR(50),
    background_check_completed_at TIMESTAMP,
    background_check_expires_at TIMESTAMP,
    background_check_result JSONB,

    -- References
    references_status verification_status DEFAULT 'PENDING',
    references_count INTEGER DEFAULT 0,
    references_data JSONB,

    -- Interview
    interview_status verification_status DEFAULT 'PENDING',
    interview_date TIMESTAMP,
    interview_notes TEXT,
    interview_rating INTEGER,

    -- Level
    verification_level VARCHAR(20),

    -- Re-verification
    needs_reverification BOOLEAN DEFAULT FALSE,
    last_verified_at TIMESTAMP,
    next_verification_due TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_verifications_housekeeper_id ON verifications(housekeeper_id);

-- ============================================
-- TRUST SCORES TABLE
-- ============================================

CREATE TABLE trust_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    client_id UUID UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
    housekeeper_id UUID UNIQUE REFERENCES housekeepers(id) ON DELETE CASCADE,

    score INTEGER DEFAULT 0 CHECK (score BETWEEN 0 AND 100),

    verification_score INTEGER DEFAULT 0,
    behavioral_score INTEGER DEFAULT 0,
    transaction_score INTEGER DEFAULT 0,
    review_score INTEGER DEFAULT 0,

    score_history JSONB,

    risk_level risk_level DEFAULT 'MEDIUM',
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reasons TEXT[],

    last_calculated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_trust_scores_user_id ON trust_scores(user_id);
CREATE INDEX idx_trust_scores_score ON trust_scores(score);

-- ============================================
-- DISPUTES TABLE
-- ============================================

CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id),

    initiated_by UUID NOT NULL,
    against UUID NOT NULL,

    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    evidence JSONB,

    status dispute_status DEFAULT 'OPEN',
    resolution TEXT,
    resolution_notes TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

CREATE INDEX idx_disputes_booking_id ON disputes(booking_id);
CREATE INDEX idx_disputes_status ON disputes(status);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    data JSONB,

    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,

    push_sent BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    client_id UUID NOT NULL,
    housekeeper_id UUID NOT NULL,

    last_message_at TIMESTAMP,
    last_message_preview TEXT,

    client_unread_count INTEGER DEFAULT 0,
    housekeeper_unread_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_client_id ON conversations(client_id);
CREATE INDEX idx_conversations_housekeeper_id ON conversations(housekeeper_id);
CREATE INDEX idx_conversations_booking_id ON conversations(booking_id);

-- ============================================
-- MESSAGES TABLE
-- ============================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),

    message_type VARCHAR(20) DEFAULT 'text',
    message_content TEXT NOT NULL,
    media_url VARCHAR(500),

    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ============================================
-- BANK ACCOUNTS TABLE
-- ============================================

CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    housekeeper_id UUID UNIQUE NOT NULL REFERENCES housekeepers(id) ON DELETE CASCADE,

    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(255) NOT NULL, -- Should be encrypted in production
    account_holder VARCHAR(255) NOT NULL,
    clabe VARCHAR(18),

    is_verified BOOLEAN DEFAULT FALSE,
    is_default BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bank_accounts_housekeeper_id ON bank_accounts(housekeeper_id);

-- ============================================
-- PAYOUTS TABLE (for housekeepers)
-- ============================================

CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    housekeeper_id UUID NOT NULL REFERENCES housekeepers(id),

    amount DECIMAL(10,2) NOT NULL,
    commission DECIMAL(10,2) NOT NULL,
    net_amount DECIMAL(10,2) NOT NULL,

    booking_ids UUID[],

    payout_method VARCHAR(50),
    status VARCHAR(20),

    bank_account_id UUID REFERENCES bank_accounts(id),
    transaction_reference VARCHAR(255),

    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_payouts_housekeeper_id ON payouts(housekeeper_id);
CREATE INDEX idx_payouts_status ON payouts(status);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_housekeepers_updated_at BEFORE UPDATE ON housekeepers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trust_scores_updated_at BEFORE UPDATE ON trust_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'Base user table for all user types';
COMMENT ON TABLE clients IS 'Client-specific profile data';
COMMENT ON TABLE housekeepers IS 'Housekeeper-specific profile and statistics';
COMMENT ON TABLE bookings IS 'Service bookings between clients and housekeepers';
COMMENT ON TABLE payments IS 'Payment records for bookings';
COMMENT ON TABLE reviews IS 'Bidirectional reviews between clients and housekeepers';
COMMENT ON TABLE verifications IS 'Identity and background verification data for housekeepers';
COMMENT ON TABLE trust_scores IS 'Trust and safety scores for users';
COMMENT ON TABLE disputes IS 'Dispute cases between users';
COMMENT ON TABLE notifications IS 'Push, email, and SMS notifications';
COMMENT ON TABLE conversations IS 'Chat conversations between users';
COMMENT ON TABLE messages IS 'Individual chat messages';
COMMENT ON TABLE bank_accounts IS 'Bank account information for payouts';
