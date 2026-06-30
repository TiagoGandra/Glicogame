-- ============================================================
-- GLICOGAME · Função RPC para incrementar XP do usuário
-- Execute no SQL Editor do Supabase APÓS o schema.sql
-- ============================================================

create or replace function public.increment_xp(p_user_id uuid, p_xp int)
returns void as $$
declare
  v_xp_total   int;
  v_xp_proximo int;
  v_nivel      int;
begin
  -- Busca dados atuais
  select xp_total, xp_proximo, nivel
    into v_xp_total, v_xp_proximo, v_nivel
    from public.users
   where id = p_user_id;

  -- Se usuário não existe, ignora
  if not found then return; end if;

  -- Incrementa XP
  v_xp_total := v_xp_total + p_xp;

  -- Verifica level up (loop para caso de múltiplos level ups)
  while v_xp_total >= v_xp_proximo loop
    v_xp_total  := v_xp_total - v_xp_proximo;
    v_nivel     := v_nivel + 1;
    v_xp_proximo := v_xp_proximo + 50;  -- Cada nível exige 50 XP a mais
  end loop;

  -- Atualiza o usuário
  update public.users
     set xp_total   = v_xp_total,
         xp_proximo = v_xp_proximo,
         nivel      = v_nivel,
         updated_at = now()
   where id = p_user_id;
end;
$$ language plpgsql security definer;
