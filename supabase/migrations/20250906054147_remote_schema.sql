alter table "public"."communities" alter column "created_at" set not null;

alter table "public"."communities" alter column "updated_at" set not null;

alter table "public"."community_threads" add column "slug" text;

alter table "public"."community_threads" alter column "author" set not null;

alter table "public"."community_threads" alter column "created_at" set not null;

alter table "public"."community_threads" alter column "updated_at" set not null;

CREATE UNIQUE INDEX idx_community_threads_slug ON public.community_threads USING btree (slug);


