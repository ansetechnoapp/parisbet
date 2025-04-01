-- Sample data for tickets table

-- Poto tickets
INSERT INTO tickets (ticket_number, date, type, numbers, amount, status, phone_number)
VALUES 
    ('PT-20230501-001', '2023-05-01 10:15:00+00', 'Poto', ARRAY[12, 34, 56, 78, 90], 1000.00, 'won', '22901234567'),
    ('PT-20230502-002', '2023-05-02 14:30:00+00', 'Poto', ARRAY[23, 45, 67, 89, 10], 500.00, 'lost', '22907654321'),
    ('PT-20230503-003', '2023-05-03 09:45:00+00', 'Poto', ARRAY[11, 22, 33, 44, 55], 2000.00, 'pending', '22909876543');

-- Tout chaud tickets
INSERT INTO tickets (ticket_number, date, type, numbers, amount, status, phone_number)
VALUES 
    ('TC-20230504-001', '2023-05-04 11:20:00+00', 'Tout chaud', ARRAY[15, 26, 37, 48, 59], 1500.00, 'won', '22901122334'),
    ('TC-20230505-002', '2023-05-05 16:10:00+00', 'Tout chaud', ARRAY[10, 20, 30, 40, 50], 750.00, 'lost', '22905544332'),
    ('TC-20230506-003', '2023-05-06 13:25:00+00', 'Tout chaud', ARRAY[19, 28, 37, 46, 55], 1200.00, 'pending', '22909988776');

-- 3 Nape tickets
INSERT INTO tickets (ticket_number, date, type, numbers, amount, status, phone_number)
VALUES 
    ('3N-20230507-001', '2023-05-07 10:30:00+00', '3 Nape', ARRAY[12, 34, 56], 800.00, 'won', '22901234567'),
    ('3N-20230508-002', '2023-05-08 15:45:00+00', '3 Nape', ARRAY[23, 45, 67], 600.00, 'lost', '22907654321'),
    ('3N-20230509-003', '2023-05-09 12:15:00+00', '3 Nape', ARRAY[11, 22, 33], 900.00, 'pending', '22909876543');

-- 4 Nape tickets
INSERT INTO tickets (ticket_number, date, type, numbers, amount, status, phone_number)
VALUES 
    ('4N-20230510-001', '2023-05-10 09:20:00+00', '4 Nape', ARRAY[15, 26, 37, 48], 1200.00, 'won', '22901122334'),
    ('4N-20230511-002', '2023-05-11 14:35:00+00', '4 Nape', ARRAY[10, 20, 30, 40], 950.00, 'lost', '22905544332'),
    ('4N-20230512-003', '2023-05-12 11:50:00+00', '4 Nape', ARRAY[19, 28, 37, 46], 1100.00, 'pending', '22909988776');

-- Perm tickets
INSERT INTO tickets (ticket_number, date, type, numbers, amount, status, phone_number)
VALUES 
    ('PM-20230513-001', '2023-05-13 10:05:00+00', 'Perm', ARRAY[12, 34, 56, 78, 90, 11], 1800.00, 'won', '22901234567'),
    ('PM-20230514-002', '2023-05-14 15:20:00+00', 'Perm', ARRAY[23, 45, 67, 89, 10, 32], 1500.00, 'lost', '22907654321'),
    ('PM-20230515-003', '2023-05-15 12:40:00+00', 'Perm', ARRAY[11, 22, 33, 44, 55, 66], 2200.00, 'pending', '22909876543');

-- More recent tickets with current dates
INSERT INTO tickets (ticket_number, date, type, numbers, amount, status, phone_number)
VALUES 
    ('PT-20240601-001', NOW() - INTERVAL '2 days', 'Poto', ARRAY[14, 25, 36, 47, 58], 1000.00, 'won', '22901234567'),
    ('TC-20240602-001', NOW() - INTERVAL '1 day', 'Tout chaud', ARRAY[19, 28, 37, 46, 55], 1500.00, 'pending', '22907654321'),
    ('3N-20240603-001', NOW(), '3 Nape', ARRAY[11, 22, 33], 800.00, 'pending', '22909876543'),
    ('4N-20240604-001', NOW(), '4 Nape', ARRAY[15, 26, 37, 48], 1200.00, 'pending', '22901122334'),
    ('PM-20240605-001', NOW() + INTERVAL '1 day', 'Perm', ARRAY[12, 23, 34, 45, 56, 67], 2000.00, 'pending', '22905544332');
