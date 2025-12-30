-- ============================================
-- SOCIAL FEATURES: NOTIFICATIONS TABLE
-- Activity notifications for artists
-- ============================================

-- ============================================
-- NOTIFICATION TYPE ENUM
-- ============================================
CREATE TYPE notification_type AS ENUM (
  'new_follower',       -- Someone followed you
  'portfolio_like',     -- Someone liked your portfolio item
  'portfolio_comment',  -- Someone commented on your portfolio item
  'comment_reply',      -- Someone replied to your comment
  'mention',            -- Future: @mentions in comments
  'event_reminder',     -- Future: Upcoming event reminder
  'system'              -- System announcements
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES artists(id) ON DELETE SET NULL, -- Who triggered it
  notification_type notification_type NOT NULL,

  -- Polymorphic reference to the related entity
  entity_type TEXT, -- 'portfolio_item', 'comment', 'follow', 'event'
  entity_id UUID,

  -- Flexible payload for additional context
  payload JSONB DEFAULT '{}',

  -- Status
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_unread ON notifications(recipient_id, is_read)
  WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_entity ON notifications(entity_type, entity_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Artists can only view their own notifications
CREATE POLICY "Artists can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = notifications.recipient_id AND artists.user_id = auth.uid()
    )
  );

-- Artists can mark their own notifications as read
CREATE POLICY "Artists can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = notifications.recipient_id AND artists.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = notifications.recipient_id AND artists.user_id = auth.uid()
    )
  );

-- System/triggers can insert notifications
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Artists can delete their own notifications
CREATE POLICY "Artists can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artists
      WHERE artists.id = notifications.recipient_id AND artists.user_id = auth.uid()
    )
  );

-- Admins have full access
CREATE POLICY "Admins full access to notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- NOTIFICATION TRIGGER FUNCTIONS
-- ============================================

-- Create notification for new follower
CREATE OR REPLACE FUNCTION notify_new_follower()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  follower_artist RECORD;
BEGIN
  -- Get follower details
  SELECT id, display_name, slug, profile_photo INTO follower_artist
  FROM artists WHERE id = NEW.follower_id;

  -- Insert notification
  INSERT INTO notifications (
    recipient_id,
    actor_id,
    notification_type,
    entity_type,
    entity_id,
    payload
  ) VALUES (
    NEW.following_id,
    NEW.follower_id,
    'new_follower',
    'follow',
    NEW.id,
    jsonb_build_object(
      'follower_name', follower_artist.display_name,
      'follower_slug', follower_artist.slug,
      'follower_photo', follower_artist.profile_photo
    )
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_new_follower
  AFTER INSERT ON follows
  FOR EACH ROW EXECUTE FUNCTION notify_new_follower();

-- Create notification for new like
CREATE OR REPLACE FUNCTION notify_portfolio_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  liker_artist RECORD;
  portfolio RECORD;
  portfolio_owner_id UUID;
BEGIN
  -- Get liker details
  SELECT id, display_name, slug, profile_photo INTO liker_artist
  FROM artists WHERE id = NEW.artist_id;

  -- Get portfolio item and owner
  SELECT pi.id, pi.title, pi.thumbnail_url, pi.artist_id INTO portfolio
  FROM portfolio_items pi WHERE pi.id = NEW.portfolio_item_id;

  portfolio_owner_id := portfolio.artist_id;

  -- Don't notify if liking own work
  IF portfolio_owner_id = NEW.artist_id THEN
    RETURN NEW;
  END IF;

  -- Insert notification
  INSERT INTO notifications (
    recipient_id,
    actor_id,
    notification_type,
    entity_type,
    entity_id,
    payload
  ) VALUES (
    portfolio_owner_id,
    NEW.artist_id,
    'portfolio_like',
    'portfolio_item',
    NEW.portfolio_item_id,
    jsonb_build_object(
      'portfolio_title', portfolio.title,
      'portfolio_thumbnail', portfolio.thumbnail_url,
      'actor_name', liker_artist.display_name,
      'actor_slug', liker_artist.slug
    )
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_portfolio_like
  AFTER INSERT ON likes
  FOR EACH ROW EXECUTE FUNCTION notify_portfolio_like();

-- Create notification for new comment
CREATE OR REPLACE FUNCTION notify_portfolio_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  commenter_artist RECORD;
  portfolio RECORD;
  portfolio_owner_id UUID;
  parent_comment RECORD;
BEGIN
  -- Get commenter details
  SELECT id, display_name, slug, profile_photo INTO commenter_artist
  FROM artists WHERE id = NEW.artist_id;

  -- Get portfolio item and owner
  SELECT pi.id, pi.title, pi.thumbnail_url, pi.artist_id INTO portfolio
  FROM portfolio_items pi WHERE pi.id = NEW.portfolio_item_id;

  portfolio_owner_id := portfolio.artist_id;

  -- Handle reply notification
  IF NEW.parent_id IS NOT NULL THEN
    SELECT c.artist_id INTO parent_comment FROM comments c WHERE c.id = NEW.parent_id;

    -- Notify parent comment author (if not same person)
    IF parent_comment.artist_id != NEW.artist_id THEN
      INSERT INTO notifications (
        recipient_id,
        actor_id,
        notification_type,
        entity_type,
        entity_id,
        payload
      ) VALUES (
        parent_comment.artist_id,
        NEW.artist_id,
        'comment_reply',
        'comment',
        NEW.id,
        jsonb_build_object(
          'portfolio_title', portfolio.title,
          'comment_preview', left(NEW.content, 100),
          'actor_name', commenter_artist.display_name,
          'actor_slug', commenter_artist.slug
        )
      );
    END IF;
  END IF;

  -- Notify portfolio owner (if not same person and not replying to own comment)
  IF portfolio_owner_id != NEW.artist_id THEN
    INSERT INTO notifications (
      recipient_id,
      actor_id,
      notification_type,
      entity_type,
      entity_id,
      payload
    ) VALUES (
      portfolio_owner_id,
      NEW.artist_id,
      'portfolio_comment',
      'portfolio_item',
      NEW.portfolio_item_id,
      jsonb_build_object(
        'portfolio_title', portfolio.title,
        'comment_preview', left(NEW.content, 100),
        'actor_name', commenter_artist.display_name,
        'actor_slug', commenter_artist.slug
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_portfolio_comment
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION notify_portfolio_comment();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get unread notification count for current user
CREATE OR REPLACE FUNCTION get_unread_notification_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  my_artist_id UUID;
  unread_count INTEGER;
BEGIN
  SELECT id INTO my_artist_id FROM artists WHERE user_id = auth.uid() LIMIT 1;

  IF my_artist_id IS NULL THEN
    RETURN 0;
  END IF;

  SELECT COUNT(*) INTO unread_count
  FROM notifications
  WHERE recipient_id = my_artist_id AND is_read = false;

  RETURN unread_count;
END;
$$;

GRANT EXECUTE ON FUNCTION get_unread_notification_count() TO authenticated;

-- Mark all notifications as read for current user
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  my_artist_id UUID;
BEGIN
  SELECT id INTO my_artist_id FROM artists WHERE user_id = auth.uid() LIMIT 1;

  IF my_artist_id IS NOT NULL THEN
    UPDATE notifications
    SET is_read = true, read_at = NOW()
    WHERE recipient_id = my_artist_id AND is_read = false;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION mark_all_notifications_read() TO authenticated;

-- ============================================
-- ENABLE REALTIME FOR NOTIFICATIONS
-- ============================================
-- Note: Run this separately if needed
-- ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
