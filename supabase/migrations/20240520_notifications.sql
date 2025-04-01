-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read);

-- Add trigger for updated_at
CREATE TRIGGER set_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Only authenticated users can insert notifications
CREATE POLICY "Only authenticated users can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Add function to create a notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info'
) RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (p_user_id, p_title, p_message, p_type)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to create notifications for transaction status changes
CREATE OR REPLACE FUNCTION notify_transaction_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_title TEXT;
  v_message TEXT;
  v_type TEXT;
BEGIN
  -- Only proceed if status has changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Set notification details based on transaction type and new status
  IF NEW.type = 'top_up' THEN
    IF NEW.status = 'approved' THEN
      v_title := 'Recharge approuvée';
      v_message := 'Votre recharge de ' || NEW.amount || ' FCFA a été approuvée.';
      v_type := 'success';
    ELSIF NEW.status = 'rejected' THEN
      v_title := 'Recharge rejetée';
      v_message := 'Votre recharge de ' || NEW.amount || ' FCFA a été rejetée.';
      v_type := 'error';
    END IF;
  ELSIF NEW.type = 'withdrawal' THEN
    IF NEW.status = 'approved' THEN
      v_title := 'Retrait approuvé';
      v_message := 'Votre retrait de ' || NEW.amount || ' FCFA a été approuvé.';
      v_type := 'success';
    ELSIF NEW.status = 'rejected' THEN
      v_title := 'Retrait rejeté';
      v_message := 'Votre retrait de ' || NEW.amount || ' FCFA a été rejeté.';
      v_type := 'error';
    END IF;
  END IF;
  
  -- Create notification if we have a title (status change we care about)
  IF v_title IS NOT NULL THEN
    PERFORM create_notification(NEW.user_id, v_title, v_message, v_type);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for transaction status changes
CREATE TRIGGER transaction_status_change_notification
AFTER UPDATE OF status ON transactions
FOR EACH ROW
EXECUTE FUNCTION notify_transaction_status_change();

-- Add function to create notifications for bet status changes
CREATE OR REPLACE FUNCTION notify_bet_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_title TEXT;
  v_message TEXT;
  v_type TEXT;
  v_user_id UUID;
BEGIN
  -- Only proceed if status has changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Find the user_id from the phone_number
  SELECT user_id INTO v_user_id
  FROM user_profiles
  WHERE phone_number = NEW.phone_number;
  
  -- Only proceed if we found a user
  IF v_user_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Set notification details based on new status
  IF NEW.status = 'won' THEN
    v_title := 'Pari gagné !';
    v_message := 'Félicitations ! Votre pari a été gagné. Vous avez remporté ' || NEW.potential_winnings || ' FCFA.';
    v_type := 'success';
  ELSIF NEW.status = 'lost' THEN
    v_title := 'Pari perdu';
    v_message := 'Votre pari a été perdu. Tentez à nouveau votre chance !';
    v_type := 'warning';
  END IF;
  
  -- Create notification if we have a title (status change we care about)
  IF v_title IS NOT NULL THEN
    PERFORM create_notification(v_user_id, v_title, v_message, v_type);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for bet status changes
CREATE TRIGGER bet_status_change_notification
AFTER UPDATE OF status ON football_bets
FOR EACH ROW
EXECUTE FUNCTION notify_bet_status_change();

-- Add function to create notifications for ticket status changes
CREATE OR REPLACE FUNCTION notify_ticket_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_title TEXT;
  v_message TEXT;
  v_type TEXT;
  v_user_id UUID;
BEGIN
  -- Only proceed if status has changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Find the user_id from the phone_number
  SELECT user_id INTO v_user_id
  FROM user_profiles
  WHERE phone_number = NEW.phone_number;
  
  -- Only proceed if we found a user
  IF v_user_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Set notification details based on new status
  IF NEW.status = 'won' THEN
    v_title := 'Ticket gagnant !';
    v_message := 'Félicitations ! Votre ticket ' || NEW.ticket_number || ' est gagnant.';
    v_type := 'success';
  ELSIF NEW.status = 'lost' THEN
    v_title := 'Ticket perdant';
    v_message := 'Votre ticket ' || NEW.ticket_number || ' n''a pas été gagnant. Tentez à nouveau votre chance !';
    v_type := 'warning';
  END IF;
  
  -- Create notification if we have a title (status change we care about)
  IF v_title IS NOT NULL THEN
    PERFORM create_notification(v_user_id, v_title, v_message, v_type);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for ticket status changes
CREATE TRIGGER ticket_status_change_notification
AFTER UPDATE OF status ON tickets
FOR EACH ROW
EXECUTE FUNCTION notify_ticket_status_change();
