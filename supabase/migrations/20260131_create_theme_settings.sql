-- Insert default theme settings if they don't exist
INSERT INTO site_settings (key, value)
VALUES
  ('theme_primary', '#3D2B1F'),
  ('theme_primary_hover', '#4D3B2F'),
  ('theme_accent', '#EAE0D5'),
  ('theme_soft_cream', '#F5F1ED'),
  ('theme_text_dark', '#2A1D15'),
  ('theme_text_light', '#FFFFFF')
ON CONFLICT (key) DO NOTHING;
