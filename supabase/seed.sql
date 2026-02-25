-- Seed data for RENTO application
-- Run this after running the initial migration

-- Insert sample apartments (these will be visible to all users)
INSERT INTO apartments (name, description, address, bedrooms, bathrooms, price, image_url, status) VALUES
('Skyline Penthouse', 'Luxurious penthouse with panoramic city views, modern finishes, and premium amenities. Features include a private terrace, smart home system, and concierge service.', '123 Downtown Avenue, City Center', 3, 2, 2500, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'available'),
('Harbor View Loft', 'Spacious waterfront loft with floor-to-ceiling windows, exposed brick, and industrial-chic design. Walking distance to marina and restaurants.', '45 Marina Drive, Waterfront', 2, 2, 1800, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'available'),
('Garden Oasis Studio', 'Cozy studio apartment with private garden access, perfect for young professionals. Includes modern kitchen and in-unit laundry.', '78 Green Street, Suburb', 1, 1, 1200, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'available'),
('Metropolitan Suite', 'Contemporary 2-bedroom suite in the heart of downtown. Features include gym access, rooftop pool, and 24/7 security.', '200 Main Street, Downtown', 2, 1, 1950, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'available'),
('Riverside Retreat', 'Peaceful 3-bedroom home with river views and private parking. Family-friendly neighborhood with parks and schools nearby.', '56 River Road, Riverside', 3, 2, 2200, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'available'),
('Urban Nest', 'Modern 1-bedroom apartment with open floor plan and high-end appliances. Pet-friendly building with rooftop terrace.', '89 Urban Plaza, Midtown', 1, 1, 1500, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'available');

-- Note: Admin user will be created automatically when gathaiyalewis1122@gmail.com signs up
-- The trigger will assign admin role to this specific email

-- Sample data for testing (optional - uncomment if needed)
-- You can add more sample bookings and payments after users are created
