-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create matches table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_team VARCHAR(255) NOT NULL,
    away_team VARCHAR(255) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    league VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'live', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lotto_results table
CREATE TABLE lotto_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_time TIME NOT NULL,
    draw_date DATE NOT NULL,
    numbers INTEGER[] NOT NULL CHECK (array_length(numbers, 1) = 5),
    type VARCHAR(20) NOT NULL CHECK (type IN ('Fortune 14H', 'Fortune 18H')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(20) NOT NULL UNIQUE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Poto', 'Tout chaud', '3 Nape', '4 Nape', 'Perm')),
    numbers INTEGER[] NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'won', 'lost')),
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_matches_date ON matches(date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_lotto_results_draw_date ON lotto_results(draw_date);
CREATE INDEX idx_lotto_results_type ON lotto_results(type);
CREATE INDEX idx_tickets_date ON tickets(date);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_phone_number ON tickets(phone_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_matches_updated_at
    BEFORE UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lotto_results_updated_at
    BEFORE UPDATE ON lotto_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotto_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for matches
CREATE POLICY "Enable read access for all users" ON matches
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON matches
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON matches
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON matches
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for lotto_results
CREATE POLICY "Enable read access for all users" ON lotto_results
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON lotto_results
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON lotto_results
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON lotto_results
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for tickets
CREATE POLICY "Enable read access for all users" ON tickets
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON tickets
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON tickets
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON tickets
    FOR DELETE USING (auth.role() = 'authenticated');
