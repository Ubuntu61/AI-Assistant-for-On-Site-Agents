-- Enable pgvector extension
create extension if not exists vector;

-- Knowledge base table for Sales Copilot
create table if not exists public.knowledge_base (
  id          uuid default gen_random_uuid() primary key,
  content     text not null,
  type        text not null default 'description' check (type in ('qa', 'description')),
  category    text default 'general',
  source_name text,
  image_url   text,
  embedding   vector(1024),   -- text-embedding-v4 default dimension
  fts         tsvector generated always as (to_tsvector('simple', content)) stored,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Vector index for semantic search
create index if not exists knowledge_base_embedding_idx
  on public.knowledge_base
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Full-text search index
create index if not exists knowledge_base_fts_idx
  on public.knowledge_base
  using gin (fts);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger knowledge_base_updated_at
  before update on public.knowledge_base
  for each row execute function public.set_updated_at();

-- Hybrid search function
create or replace function public.hybrid_search(
  query_text    text,
  query_embedding vector(1024),
  match_count   int default 5,
  rrf_k         int default 60
)
returns table (
  id          uuid,
  content     text,
  type        text,
  category    text,
  source_name text,
  image_url   text,
  score       float
)
language sql stable
as $$
  with semantic_results as (
    select
      id,
      row_number() over (order by embedding <=> query_embedding) as rank
    from public.knowledge_base
    where embedding is not null
    order by embedding <=> query_embedding
    limit 20
  ),
  keyword_results as (
    select
      id,
      row_number() over (order by ts_rank(fts, websearch_to_tsquery('simple', query_text)) desc) as rank
    from public.knowledge_base
    where fts @@ websearch_to_tsquery('simple', query_text)
    order by ts_rank(fts, websearch_to_tsquery('simple', query_text)) desc
    limit 20
  ),
  rrf_scores as (
    select
      coalesce(s.id, k.id) as id,
      coalesce(1.0 / (rrf_k + s.rank), 0) * 0.7 +
      coalesce(1.0 / (rrf_k + k.rank), 0) * 0.3 as score
    from semantic_results s
    full outer join keyword_results k on s.id = k.id
  )
  select
    kb.id,
    kb.content,
    kb.type,
    kb.category,
    kb.source_name,
    kb.image_url,
    r.score
  from rrf_scores r
  join public.knowledge_base kb on kb.id = r.id
  order by r.score desc
  limit match_count;
$$;

-- RLS: allow service role full access, disable for anon
alter table public.knowledge_base enable row level security;

create policy "service role full access"
  on public.knowledge_base
  for all
  to service_role
  using (true)
  with check (true);

-- Storage bucket for knowledge base images
insert into storage.buckets (id, name, public)
values ('knowledge-images', 'knowledge-images', true)
on conflict (id) do nothing;

create policy "public read knowledge images"
  on storage.objects for select
  to public
  using (bucket_id = 'knowledge-images');

create policy "service role upload knowledge images"
  on storage.objects for insert
  to service_role
  with check (bucket_id = 'knowledge-images');
