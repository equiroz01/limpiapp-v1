-- LimpiApp - Seed Data
-- Sample data for development and testing

-- ============================================
-- SEED USERS
-- ============================================

-- Admin User
INSERT INTO users (id, email, password_hash, first_name, last_name, user_type, status, email_verified, phone_verified)
VALUES
('00000000-0000-0000-0000-000000000001',
 'admin@limpiapp.com',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kuWvQNPbQV6e', -- password: admin123
 'Admin',
 'LimpiApp',
 'ADMIN',
 'ACTIVE',
 TRUE,
 TRUE);

-- ============================================
-- SEED CLIENTS
-- ============================================

-- Client 1: María López
INSERT INTO users (id, email, password_hash, first_name, last_name, user_type, status, phone, email_verified, phone_verified)
VALUES
('11111111-1111-1111-1111-111111111111',
 'maria.lopez@example.com',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kuWvQNPbQV6e', -- password: password123
 'María',
 'López',
 'CLIENT',
 'ACTIVE',
 '+5215512345678',
 TRUE,
 TRUE);

INSERT INTO clients (id, user_id, total_bookings, total_spent, preferences)
VALUES
('c1111111-1111-1111-1111-111111111111',
 '11111111-1111-1111-1111-111111111111',
 5,
 2500.00,
 '{"homeSize": "medium", "favoriteServices": ["cleaning", "bathrooms"], "preferredFrequency": "weekly"}'::jsonb);

-- Client 2: Carlos Ruiz
INSERT INTO users (id, email, password_hash, first_name, last_name, user_type, status, phone, email_verified, phone_verified)
VALUES
('11111111-1111-1111-1111-111111111112',
 'carlos.ruiz@example.com',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kuWvQNPbQV6e',
 'Carlos',
 'Ruiz',
 'CLIENT',
 'ACTIVE',
 '+5215512345679',
 TRUE,
 TRUE);

INSERT INTO clients (id, user_id, total_bookings, total_spent)
VALUES
('c1111111-1111-1111-1111-111111111112',
 '11111111-1111-1111-1111-111111111112',
 2,
 800.00);

-- Client 3: Laura Martínez
INSERT INTO users (id, email, password_hash, first_name, last_name, user_type, status, phone, email_verified)
VALUES
('11111111-1111-1111-1111-111111111113',
 'laura.martinez@example.com',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kuWvQNPbQV6e',
 'Laura',
 'Martínez',
 'CLIENT',
 'ACTIVE',
 '+5215512345680',
 TRUE);

INSERT INTO clients (id, user_id, total_bookings, total_spent)
VALUES
('c1111111-1111-1111-1111-111111111113',
 '11111111-1111-1111-1111-111111111113',
 1,
 450.00);

-- ============================================
-- SEED ADDRESSES
-- ============================================

INSERT INTO addresses (id, user_id, label, street_address, apartment_number, city, state, postal_code, latitude, longitude, is_default)
VALUES
-- María's addresses
('a1111111-1111-1111-1111-111111111111',
 '11111111-1111-1111-1111-111111111111',
 'Casa',
 'Calle Principal 123',
 'Apto 4B',
 'Ciudad de México',
 'CDMX',
 '12345',
 19.4326,
 -99.1332,
 TRUE),

('a1111111-1111-1111-1111-111111111112',
 '11111111-1111-1111-1111-111111111111',
 'Oficina',
 'Av. Reforma 456',
 'Piso 12',
 'Ciudad de México',
 'CDMX',
 '11000',
 19.4285,
 -99.1397,
 FALSE),

-- Carlos's address
('a1111111-1111-1111-1111-111111111113',
 '11111111-1111-1111-1111-111111111112',
 'Casa',
 'Calle Secundaria 789',
 NULL,
 'Ciudad de México',
 'CDMX',
 '12346',
 19.4400,
 -99.1300,
 TRUE),

-- Laura's address
('a1111111-1111-1111-1111-111111111114',
 '11111111-1111-1111-1111-111111111113',
 'Casa',
 'Avenida Central 321',
 'Casa 5',
 'Ciudad de México',
 'CDMX',
 '12347',
 19.4350,
 -99.1280,
 TRUE);

-- ============================================
-- SEED HOUSEKEEPERS
-- ============================================

-- Housekeeper 1: Ana García (Top rated)
INSERT INTO users (id, email, password_hash, first_name, last_name, user_type, status, phone, email_verified, phone_verified, profile_photo)
VALUES
('22222222-2222-2222-2222-222222222221',
 'ana.garcia@example.com',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kuWvQNPbQV6e',
 'Ana',
 'García',
 'HOUSEKEEPER',
 'ACTIVE',
 '+5215587654321',
 TRUE,
 TRUE,
 'https://i.pravatar.cc/150?img=1');

INSERT INTO housekeepers (
    id, user_id, bio, years_experience, hourly_rate, services_offered, has_own_supplies,
    is_verified, verification_status, identity_verified, background_check_status,
    total_services, total_earned, average_rating, total_reviews, acceptance_rate,
    completion_rate, cancellation_rate, is_available
)
VALUES
('h2222222-2222-2222-2222-222222222221',
 '22222222-2222-2222-2222-222222222221',
 'Profesional de limpieza con más de 5 años de experiencia. Especializada en limpieza profunda y organización de espacios. Responsable y puntual.',
 5,
 150.00,
 ARRAY['cleaning', 'deep_cleaning', 'cooking', 'bathrooms'],
 TRUE,
 TRUE,
 'APPROVED',
 TRUE,
 'APPROVED',
 487,
 73050.00,
 4.9,
 234,
 98.00,
 100.00,
 0.50,
 TRUE);

-- Housekeeper 2: Laura Martínez (Good rated)
INSERT INTO users (id, email, password_hash, first_name, last_name, user_type, status, phone, email_verified, phone_verified, profile_photo)
VALUES
('22222222-2222-2222-2222-222222222222',
 'laura.m@example.com',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kuWvQNPbQV6e',
 'Laura',
 'Martínez',
 'HOUSEKEEPER',
 'ACTIVE',
 '+5215587654322',
 TRUE,
 TRUE,
 'https://i.pravatar.cc/150?img=5');

INSERT INTO housekeepers (
    id, user_id, bio, years_experience, hourly_rate, services_offered, has_own_supplies,
    is_verified, verification_status, identity_verified, background_check_status,
    total_services, total_earned, average_rating, total_reviews, acceptance_rate,
    completion_rate, is_available
)
VALUES
('h2222222-2222-2222-2222-222222222222',
 '22222222-2222-2222-2222-222222222222',
 'Muy puntual y dedicada. Especialista en limpieza de baños y cocinas.',
 2,
 140.00,
 ARRAY['cleaning', 'bathrooms', 'laundry'],
 TRUE,
 TRUE,
 'APPROVED',
 TRUE,
 'APPROVED',
 189,
 26460.00,
 4.8,
 189,
 95.00,
 99.00,
 TRUE);

-- Housekeeper 3: Carmen López
INSERT INTO users (id, email, password_hash, first_name, last_name, user_type, status, phone, email_verified, phone_verified, profile_photo)
VALUES
('22222222-2222-2222-2222-222222222223',
 'carmen.lopez@example.com',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kuWvQNPbQV6e',
 'Carmen',
 'López',
 'HOUSEKEEPER',
 'ACTIVE',
 '+5215587654323',
 TRUE,
 TRUE,
 'https://i.pravatar.cc/150?img=9');

INSERT INTO housekeepers (
    id, user_id, bio, years_experience, hourly_rate, services_offered, has_own_supplies,
    is_verified, verification_status, identity_verified, background_check_status,
    total_services, total_earned, average_rating, total_reviews, acceptance_rate,
    completion_rate, is_available
)
VALUES
('h2222222-2222-2222-2222-222222222223',
 '22222222-2222-2222-2222-222222222223',
 'Muy profesional y detallista. Me encanta dejar los espacios impecables.',
 1,
 135.00,
 ARRAY['cleaning', 'organizing'],
 FALSE,
 TRUE,
 'APPROVED',
 TRUE,
 'APPROVED',
 156,
 21060.00,
 4.7,
 156,
 92.00,
 98.00,
 TRUE);

-- Housekeeper 4: Sofía Ramírez (New, pending verification)
INSERT INTO users (id, email, password_hash, first_name, last_name, user_type, status, phone, email_verified, profile_photo)
VALUES
('22222222-2222-2222-2222-222222222224',
 'sofia.ramirez@example.com',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kuWvQNPbQV6e',
 'Sofía',
 'Ramírez',
 'HOUSEKEEPER',
 'PENDING_VERIFICATION',
 '+5215587654324',
 TRUE,
 'https://i.pravatar.cc/150?img=16');

INSERT INTO housekeepers (
    id, user_id, bio, years_experience, hourly_rate, services_offered,
    is_verified, verification_status, identity_verified, background_check_status,
    total_services, is_available
)
VALUES
('h2222222-2222-2222-2222-222222222224',
 '22222222-2222-2222-2222-222222222224',
 'Nueva en la plataforma pero con experiencia en limpieza residencial.',
 3,
 130.00,
 ARRAY['cleaning', 'bathrooms'],
 FALSE,
 'PENDING',
 FALSE,
 'PENDING',
 0,
 FALSE);

-- ============================================
-- SEED VERIFICATIONS
-- ============================================

INSERT INTO verifications (housekeeper_id, identity_status, email_verified, phone_verified, background_check_status, verification_level)
VALUES
('h2222222-2222-2222-2222-222222222221', 'APPROVED', TRUE, TRUE, 'APPROVED', 'gold'),
('h2222222-2222-2222-2222-222222222222', 'APPROVED', TRUE, TRUE, 'APPROVED', 'silver'),
('h2222222-2222-2222-2222-222222222223', 'APPROVED', TRUE, TRUE, 'APPROVED', 'silver'),
('h2222222-2222-2222-2222-222222222224', 'PENDING', TRUE, FALSE, 'PENDING', 'bronze');

-- ============================================
-- SEED BOOKINGS
-- ============================================

-- Completed booking
INSERT INTO bookings (
    id, booking_code, client_id, housekeeper_id, address_id,
    scheduled_date, scheduled_start_time, scheduled_end_time, estimated_duration_minutes,
    actual_start_time, actual_end_time, actual_duration_minutes,
    services_requested, home_size, has_pets, special_instructions,
    base_price, subtotal, service_fee, tax, tip, total_price,
    status, accepted_at, completed_at
)
VALUES
('b1111111-1111-1111-1111-111111111111',
 'LMP-1001',
 'c1111111-1111-1111-1111-111111111111',
 'h2222222-2222-2222-2222-222222222221',
 'a1111111-1111-1111-1111-111111111111',
 '2024-11-28',
 '2024-11-28 14:00:00',
 '2024-11-28 16:00:00',
 120,
 '2024-11-28 14:05:00',
 '2024-11-28 16:10:00',
 125,
 ARRAY['cleaning', 'bathrooms'],
 'medium',
 FALSE,
 'Por favor tocar el timbre dos veces',
 300.00,
 300.00,
 30.00,
 48.00,
 45.00,
 423.00,
 'COMPLETED',
 '2024-11-27 10:30:00',
 '2024-11-28 16:10:00');

-- Accepted booking (upcoming)
INSERT INTO bookings (
    id, booking_code, client_id, housekeeper_id, address_id,
    scheduled_date, scheduled_start_time, scheduled_end_time, estimated_duration_minutes,
    services_requested, home_size,
    base_price, subtotal, service_fee, tax, total_price,
    status, accepted_at
)
VALUES
('b1111111-1111-1111-1111-111111111112',
 'LMP-1002',
 'c1111111-1111-1111-1111-111111111111',
 'h2222222-2222-2222-2222-222222222221',
 'a1111111-1111-1111-1111-111111111111',
 '2024-12-15',
 '2024-12-15 15:00:00',
 '2024-12-15 17:00:00',
 120,
 ARRAY['cleaning', 'bathrooms'],
 'medium',
 300.00,
 300.00,
 30.00,
 48.00,
 378.00,
 'ACCEPTED',
 '2024-12-01 09:00:00');

-- Pending booking
INSERT INTO bookings (
    id, booking_code, client_id, housekeeper_id, address_id,
    scheduled_date, scheduled_start_time, scheduled_end_time, estimated_duration_minutes,
    services_requested, home_size,
    base_price, subtotal, service_fee, tax, total_price,
    status
)
VALUES
('b1111111-1111-1111-1111-111111111113',
 'LMP-1003',
 'c1111111-1111-1111-1111-111111111112',
 'h2222222-2222-2222-2222-222222222222',
 'a1111111-1111-1111-1111-111111111113',
 '2024-12-16',
 '2024-12-16 10:00:00',
 '2024-12-16 11:30:00',
 90,
 ARRAY['cleaning'],
 'small',
 210.00,
 210.00,
 21.00,
 33.60,
 264.60,
 'PENDING');

-- ============================================
-- SEED REVIEWS
-- ============================================

INSERT INTO reviews (
    id, booking_id, user_id,
    client_to_housekeeper_rating, client_to_housekeeper_review, client_review_aspects,
    housekeeper_to_client_rating, housekeeper_comments
)
VALUES
('r1111111-1111-1111-1111-111111111111',
 'b1111111-1111-1111-1111-111111111111',
 '11111111-1111-1111-1111-111111111111',
 5,
 'Excelente servicio, muy profesional y dedicada. Mi casa quedó impecable. Totalmente recomendable',
 '{"punctuality": true, "quality": true, "professionalism": true, "friendliness": true}'::jsonb,
 5,
 'Cliente muy amable y respetuosa. Casa en buenas condiciones.');

-- ============================================
-- SEED NOTIFICATIONS
-- ============================================

INSERT INTO notifications (user_id, type, title, body, data, is_read)
VALUES
('11111111-1111-1111-1111-111111111111',
 'booking_confirmed',
 'Reserva confirmada',
 'Ana García aceptó tu solicitud para el 15 de diciembre a las 3:00 PM',
 '{"bookingId": "b1111111-1111-1111-1111-111111111112"}'::jsonb,
 FALSE),

('11111111-1111-1111-1111-111111111111',
 'review_reminder',
 'Califica tu servicio',
 '¿Cómo estuvo tu servicio con Ana García?',
 '{"bookingId": "b1111111-1111-1111-1111-111111111111"}'::jsonb,
 TRUE),

('22222222-2222-2222-2222-222222222221',
 'new_booking_request',
 'Nueva solicitud de servicio',
 'María López solicita un servicio para el 15 de diciembre',
 '{"bookingId": "b1111111-1111-1111-1111-111111111112"}'::jsonb,
 TRUE);

-- ============================================
-- SEED TRUST SCORES
-- ============================================

INSERT INTO trust_scores (user_id, client_id, score, verification_score, behavioral_score, transaction_score, review_score, risk_level)
VALUES
('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 85, 20, 25, 20, 20, 'LOW'),
('11111111-1111-1111-1111-111111111112', 'c1111111-1111-1111-1111-111111111112', 70, 20, 15, 15, 20, 'LOW'),
('11111111-1111-1111-1111-111111111113', 'c1111111-1111-1111-1111-111111111113', 60, 20, 10, 10, 20, 'MEDIUM');

INSERT INTO trust_scores (user_id, housekeeper_id, score, verification_score, behavioral_score, transaction_score, review_score, risk_level)
VALUES
('22222222-2222-2222-2222-222222222221', 'h2222222-2222-2222-2222-222222222221', 98, 25, 25, 25, 23, 'LOW'),
('22222222-2222-2222-2222-222222222222', 'h2222222-2222-2222-2222-222222222222', 92, 25, 23, 23, 21, 'LOW'),
('22222222-2222-2222-2222-222222222223', 'h2222222-2222-2222-2222-222222222223', 88, 25, 21, 22, 20, 'LOW'),
('22222222-2222-2222-2222-222222222224', 'h2222222-2222-2222-2222-222222222224', 30, 10, 10, 5, 5, 'MEDIUM');

-- ============================================
-- SUMMARY
-- ============================================

-- Check counts
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Clients', COUNT(*) FROM clients
UNION ALL
SELECT 'Housekeepers', COUNT(*) FROM housekeepers
UNION ALL
SELECT 'Addresses', COUNT(*) FROM addresses
UNION ALL
SELECT 'Bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'Trust Scores', COUNT(*) FROM trust_scores
UNION ALL
SELECT 'Verifications', COUNT(*) FROM verifications;
