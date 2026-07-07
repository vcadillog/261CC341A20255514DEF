--
-- PostgreSQL database dump
--

\restrict va8ytbc1Den0VOwYVHy2DxMuFphJGAQ8fpgBeEgatM9q9WIZAXHMqgfjrlNbfRk

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: candidato; Type: TABLE; Schema: public; Owner: eleccion_db
--

CREATE TABLE public.candidato (
    id_candidato bigint NOT NULL,
    candidato character varying(150) NOT NULL,
    partido character varying(150) NOT NULL
);


ALTER TABLE public.candidato OWNER TO eleccion_db;

--
-- Name: candidato_id_candidato_seq; Type: SEQUENCE; Schema: public; Owner: eleccion_db
--

CREATE SEQUENCE public.candidato_id_candidato_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidato_id_candidato_seq OWNER TO eleccion_db;

--
-- Name: candidato_id_candidato_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eleccion_db
--

ALTER SEQUENCE public.candidato_id_candidato_seq OWNED BY public.candidato.id_candidato;


--
-- Name: resultado_electoral; Type: TABLE; Schema: public; Owner: eleccion_db
--

CREATE TABLE public.resultado_electoral (
    id_resultado bigint NOT NULL,
    id_candidato bigint NOT NULL,
    votos_nacionales integer DEFAULT 0 NOT NULL,
    votos_extranjero integer DEFAULT 0 NOT NULL,
    total_votos integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.resultado_electoral OWNER TO eleccion_db;

--
-- Name: resultado_electoral_id_resultado_seq; Type: SEQUENCE; Schema: public; Owner: eleccion_db
--

CREATE SEQUENCE public.resultado_electoral_id_resultado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resultado_electoral_id_resultado_seq OWNER TO eleccion_db;

--
-- Name: resultado_electoral_id_resultado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eleccion_db
--

ALTER SEQUENCE public.resultado_electoral_id_resultado_seq OWNED BY public.resultado_electoral.id_resultado;


--
-- Name: candidato id_candidato; Type: DEFAULT; Schema: public; Owner: eleccion_db
--

ALTER TABLE ONLY public.candidato ALTER COLUMN id_candidato SET DEFAULT nextval('public.candidato_id_candidato_seq'::regclass);


--
-- Name: resultado_electoral id_resultado; Type: DEFAULT; Schema: public; Owner: eleccion_db
--

ALTER TABLE ONLY public.resultado_electoral ALTER COLUMN id_resultado SET DEFAULT nextval('public.resultado_electoral_id_resultado_seq'::regclass);


--
-- Data for Name: candidato; Type: TABLE DATA; Schema: public; Owner: eleccion_db
--

COPY public.candidato (id_candidato, candidato, partido) FROM stdin;
1	Keiko Sofia Fujimori Higuchi	Fuerza Popular
2	Roberto Helbert Sanchez Palomino	Juntos por el Perú
\.


--
-- Data for Name: resultado_electoral; Type: TABLE DATA; Schema: public; Owner: eleccion_db
--

COPY public.resultado_electoral (id_resultado, id_candidato, votos_nacionales, votos_extranjero, total_votos, created_at, updated_at) FROM stdin;
1	1	9028008	195388	9223396	2026-07-07 10:11:00.542764	2026-07-07 10:11:00.542764
2	2	9060022	113733	9173755	2026-07-07 10:11:00.542764	2026-07-07 10:11:00.542764
\.


--
-- Name: candidato_id_candidato_seq; Type: SEQUENCE SET; Schema: public; Owner: eleccion_db
--

SELECT pg_catalog.setval('public.candidato_id_candidato_seq', 1, false);


--
-- Name: resultado_electoral_id_resultado_seq; Type: SEQUENCE SET; Schema: public; Owner: eleccion_db
--

SELECT pg_catalog.setval('public.resultado_electoral_id_resultado_seq', 2, true);


--
-- Name: candidato pk_candidato; Type: CONSTRAINT; Schema: public; Owner: eleccion_db
--

ALTER TABLE ONLY public.candidato
    ADD CONSTRAINT pk_candidato PRIMARY KEY (id_candidato);


--
-- Name: resultado_electoral pk_resultado_electoral; Type: CONSTRAINT; Schema: public; Owner: eleccion_db
--

ALTER TABLE ONLY public.resultado_electoral
    ADD CONSTRAINT pk_resultado_electoral PRIMARY KEY (id_resultado);


--
-- Name: resultado_electoral fk_resultado_candidato; Type: FK CONSTRAINT; Schema: public; Owner: eleccion_db
--

ALTER TABLE ONLY public.resultado_electoral
    ADD CONSTRAINT fk_resultado_candidato FOREIGN KEY (id_candidato) REFERENCES public.candidato(id_candidato) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO eleccion_db;


--
-- PostgreSQL database dump complete
--

\unrestrict va8ytbc1Den0VOwYVHy2DxMuFphJGAQ8fpgBeEgatM9q9WIZAXHMqgfjrlNbfRk

