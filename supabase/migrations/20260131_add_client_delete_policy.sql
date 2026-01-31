-- Add delete policy for clients table
create policy "Enable delete access for all users" on public.clients
  for delete using (true);
