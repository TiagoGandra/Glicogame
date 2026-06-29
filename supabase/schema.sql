-- ============================================================
-- GLICOGAME · Supabase Schema (MVP)
-- Execute este script no SQL Editor do Supabase Dashboard
-- ============================================================

-- 0. Habilitar extensão UUID (já vem habilitada no Supabase)
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. USERS — perfil público do paciente
-- ============================================================
create table public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  nome          text        not null,
  email         text        unique not null,
  nivel         int         not null default 1,
  xp_total      int         not null default 0,
  xp_proximo    int         not null default 100,   -- XP necessário pro próximo nível
  streak_dias   int         not null default 0,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users podem ler próprio perfil"
  on public.users for select
  using (auth.uid() = id);

create policy "Users podem atualizar próprio perfil"
  on public.users for update
  using (auth.uid() = id);

-- ============================================================
-- 2. LOGS_SAUDE — registros clínicos extraídos pela IA
-- ============================================================
create type public.categoria_saude as enum (
  'glicose',
  'medicamento',
  'alimentacao',
  'atividade_fisica',
  'sintoma',
  'outro'
);

create table public.logs_saude (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid        not null references public.users(id) on delete cascade,
  categoria     public.categoria_saude not null,
  valor_glicose int,                              -- mg/dL (nullable quando não se aplica)
  descricao     text        not null,             -- texto original do paciente
  dados_json    jsonb       not null default '{}', -- dados estruturados extraídos pela IA
  xp_ganho      int         not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.logs_saude enable row level security;

create policy "Users podem ler próprios logs"
  on public.logs_saude for select
  using (auth.uid() = user_id);

create policy "Service role pode inserir logs"
  on public.logs_saude for insert
  with check (true);  -- n8n usa service_role key

-- Índice para consultas de gráfico de glicose por período
create index idx_logs_saude_user_created
  on public.logs_saude (user_id, created_at desc);

-- ============================================================
-- 3. MISSOES — tarefas diárias do paciente
-- ============================================================
create type public.status_missao as enum (
  'pendente',
  'concluida',
  'expirada'
);

create table public.missoes (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid        not null references public.users(id) on delete cascade,
  titulo        text        not null,
  descricao     text,
  horario       time,                              -- horário alvo (ex: 20:00)
  status        public.status_missao not null default 'pendente',
  xp_recompensa int         not null default 10,
  data_ref      date        not null default current_date,
  created_at    timestamptz not null default now(),
  completed_at  timestamptz
);

alter table public.missoes enable row level security;

create policy "Users podem ler próprias missões"
  on public.missoes for select
  using (auth.uid() = user_id);

create policy "Users podem atualizar próprias missões"
  on public.missoes for update
  using (auth.uid() = user_id);

create policy "Service role pode inserir missões"
  on public.missoes for insert
  with check (true);

-- ============================================================
-- 4. GAMIFICACAO — badges e conquistas desbloqueadas
-- ============================================================
create table public.conquistas (
  id            uuid primary key default uuid_generate_v4(),
  slug          text        unique not null,       -- ex: "primeira_medicao"
  titulo        text        not null,
  descricao     text        not null,
  icone         text        not null default '🏅', -- emoji ou URL de ícone
  xp_bonus      int         not null default 0,
  created_at    timestamptz not null default now()
);

create table public.user_conquistas (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  conquista_id  uuid not null references public.conquistas(id) on delete cascade,
  unlocked_at   timestamptz not null default now(),
  unique (user_id, conquista_id)
);

alter table public.conquistas enable row level security;
alter table public.user_conquistas enable row level security;

create policy "Conquistas são públicas"
  on public.conquistas for select
  using (true);

create policy "Users podem ler próprias conquistas"
  on public.user_conquistas for select
  using (auth.uid() = user_id);

create policy "Service role pode inserir conquistas"
  on public.user_conquistas for insert
  with check (true);

-- ============================================================
-- 5. SEED — Conquistas iniciais de exemplo
-- ============================================================
insert into public.conquistas (slug, titulo, descricao, icone) values
  ('primeira_medicao',   'Primeira Medição',    'Registrou a glicose pela primeira vez.',           '📊'),
  ('streak_3',           'Consistência Bronze',  'Registrou dados por 3 dias seguidos.',            '🔥'),
  ('streak_7',           'Consistência Prata',   'Registrou dados por 7 dias seguidos.',            '⚡'),
  ('streak_30',          'Consistência Ouro',    'Registrou dados por 30 dias seguidos.',           '👑'),
  ('alimentacao_saudavel','Prato Consciente',    'Registrou 10 refeições saudáveis.',               '🥗'),
  ('remedio_em_dia',     'Remédio em Dia',       'Tomou todos os remédios do dia por 7 dias.',      '💊'),
  ('nivel_5',            'Nível 5',              'Alcançou o nível 5 de experiência.',              '⭐'),
  ('nivel_10',           'Nível 10',             'Alcançou o nível 10 de experiência.',             '🌟');

-- ============================================================
-- 6. FUNCTION — atualizar updated_at automaticamente
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_users_updated
  before update on public.users
  for each row execute function public.handle_updated_at();
