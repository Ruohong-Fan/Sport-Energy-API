--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: converter; Type: SCHEMA; Schema: -; Owner: root
--

CREATE SCHEMA converter;


ALTER SCHEMA converter OWNER TO root;

--
-- Name: point; Type: SCHEMA; Schema: -; Owner: root
--

CREATE SCHEMA point;


ALTER SCHEMA point OWNER TO root;

--
-- Name: voucher; Type: SCHEMA; Schema: -; Owner: root
--

CREATE SCHEMA voucher;


ALTER SCHEMA voucher OWNER TO root;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = converter, pg_catalog;

--
-- Name: status; Type: TYPE; Schema: converter; Owner: root
--

CREATE TYPE status AS ENUM (
    'TODO',
    'DONE',
    'ERROR'
);


ALTER TYPE status OWNER TO root;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: item; Type: TABLE; Schema: converter; Owner: root
--

CREATE TABLE item (
    code bigint NOT NULL,
    if_get_point boolean,
    times_of_point integer DEFAULT 1
);


ALTER TABLE item OWNER TO root;

--
-- Name: payment_method; Type: TABLE; Schema: converter; Owner: root
--

CREATE TABLE payment_method (
    code character varying(30),
    if_get_point boolean,
    times_of_point integer DEFAULT 1
);


ALTER TABLE payment_method OWNER TO root;

--
-- Name: purchase; Type: TABLE; Schema: converter; Owner: root
--

CREATE TABLE purchase (
    id bigint NOT NULL,
    purchase_date timestamp without time zone,
    store integer,
    card_number bigint,
    item_code bigint,
    amount double precision,
    payment_method character varying(30),
    status status
);


ALTER TABLE purchase OWNER TO root;

--
-- Name: signup_voucher; Type: TABLE; Schema: converter; Owner: root
--

CREATE TABLE signup_voucher (
    voucher_amount double precision,
    validity_days integer
);


ALTER TABLE signup_voucher OWNER TO root;

--
-- Name: store; Type: TABLE; Schema: converter; Owner: root
--

CREATE TABLE store (
    store_number integer,
    if_get_point boolean,
    times_of_point integer DEFAULT 1
);


ALTER TABLE store OWNER TO root;

SET search_path = point, pg_catalog;

--
-- Name: point_detail; Type: TABLE; Schema: point; Owner: root
--

CREATE TABLE point_detail (
    card_number bigint,
    point_change integer,
    point_type character varying(30),
    corresponding_id bigint,
    "time" timestamp without time zone
);


ALTER TABLE point_detail OWNER TO root;

--
-- Name: point_total; Type: TABLE; Schema: point; Owner: root
--

CREATE TABLE point_total (
    card_number bigint NOT NULL,
    point_total integer,
    update_time timestamp without time zone
);


ALTER TABLE point_total OWNER TO root;

SET search_path = public, pg_catalog;

--
-- Name: sport_energy_account; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE sport_energy_account (
    point_account_id integer NOT NULL,
    card_number character varying(20) NOT NULL,
    point_balance integer NOT NULL,
    create_by character varying(20) NOT NULL,
    create_time timestamp without time zone NOT NULL,
    update_by character varying(20),
    update_time timestamp without time zone
);


ALTER TABLE sport_energy_account OWNER TO root;

--
-- Name: sport_energy_account_point_account_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE sport_energy_account_point_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sport_energy_account_point_account_id_seq OWNER TO root;

--
-- Name: sport_energy_account_point_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE sport_energy_account_point_account_id_seq OWNED BY sport_energy_account.point_account_id;


--
-- Name: sport_energy_transaction; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE sport_energy_transaction (
    point_transaction_id integer NOT NULL,
    point_account_id integer,
    point_change integer,
    point_status integer,
    event_id integer,
    create_by character varying(20),
    create_time timestamp without time zone,
    update_by character varying(20),
    update_time timestamp without time zone,
    expire_time timestamp without time zone,
    external_id character varying(60),
    card_number character varying(20)
);


ALTER TABLE sport_energy_transaction OWNER TO root;

--
-- Name: sport_energy_transaction_detail; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE sport_energy_transaction_detail (
    point_transaction_id integer,
    item_code character varying(20),
    line_number integer,
    quantity integer,
    point_change_item integer,
    point_status integer
);


ALTER TABLE sport_energy_transaction_detail OWNER TO root;

--
-- Name: sport_energy_transaction_point_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE sport_energy_transaction_point_transaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sport_energy_transaction_point_transaction_id_seq OWNER TO root;

--
-- Name: sport_energy_transaction_point_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE sport_energy_transaction_point_transaction_id_seq OWNED BY sport_energy_transaction.point_transaction_id;


SET search_path = voucher, pg_catalog;

--
-- Name: voucher; Type: TABLE; Schema: voucher; Owner: root
--

CREATE TABLE voucher (
    voucher_number bigint,
    pin_code integer,
    amount double precision,
    card_number bigint,
    activated_status boolean,
    activated_time timestamp without time zone,
    used_status boolean,
    used_time timestamp without time zone,
    validity_days integer,
    redeem_id bigint
);


ALTER TABLE voucher OWNER TO root;

--
-- Name: voucher_pool; Type: TABLE; Schema: voucher; Owner: root
--

CREATE TABLE voucher_pool (
    voucher_number bigint,
    pin_code integer,
    amount double precision
);


ALTER TABLE voucher_pool OWNER TO root;

SET search_path = public, pg_catalog;

--
-- Name: sport_energy_account point_account_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY sport_energy_account ALTER COLUMN point_account_id SET DEFAULT nextval('sport_energy_account_point_account_id_seq'::regclass);


--
-- Name: sport_energy_transaction point_transaction_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY sport_energy_transaction ALTER COLUMN point_transaction_id SET DEFAULT nextval('sport_energy_transaction_point_transaction_id_seq'::regclass);


SET search_path = converter, pg_catalog;

--
-- Data for Name: item; Type: TABLE DATA; Schema: converter; Owner: root
--

COPY item (code, if_get_point, times_of_point) FROM stdin;
10000	f	1
20000	t	1
30000	t	1
40000	t	1
50000	t	3
\.


--
-- Data for Name: payment_method; Type: TABLE DATA; Schema: converter; Owner: root
--

COPY payment_method (code, if_get_point, times_of_point) FROM stdin;
cash	t	1
cheque	f	1
alipay	t	2
\.


--
-- Data for Name: purchase; Type: TABLE DATA; Schema: converter; Owner: root
--

COPY purchase (id, purchase_date, store, card_number, item_code, amount, payment_method, status) FROM stdin;
\.


--
-- Data for Name: signup_voucher; Type: TABLE DATA; Schema: converter; Owner: root
--

COPY signup_voucher (voucher_amount, validity_days) FROM stdin;
5	30
\.


--
-- Data for Name: store; Type: TABLE DATA; Schema: converter; Owner: root
--

COPY store (store_number, if_get_point, times_of_point) FROM stdin;
1212	t	3
388	t	1
809	f	1
\.


SET search_path = point, pg_catalog;

--
-- Data for Name: point_detail; Type: TABLE DATA; Schema: point; Owner: root
--

COPY point_detail (card_number, point_change, point_type, corresponding_id, "time") FROM stdin;
2090537712048	180	1	23489	2017-10-26 09:43:00.933236
2090537712048	90	1	293847	2017-10-26 11:59:07.990933
2090537712048	500	6	0	2017-10-26 13:32:12.36779
2090537712048	-300	6	\N	2017-10-26 13:35:58.994168
\.


--
-- Data for Name: point_total; Type: TABLE DATA; Schema: point; Owner: root
--

COPY point_total (card_number, point_total, update_time) FROM stdin;
2090537712048	470	2017-10-26 13:35:58.994168
\.


SET search_path = public, pg_catalog;

--
-- Data for Name: sport_energy_account; Type: TABLE DATA; Schema: public; Owner: root
--

COPY sport_energy_account (point_account_id, card_number, point_balance, create_by, create_time, update_by, update_time) FROM stdin;
18	2090537712050	0	RFAN27	2018-07-17 13:50:57.542754	\N	\N
\.


--
-- Name: sport_energy_account_point_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('sport_energy_account_point_account_id_seq', 18, true);


--
-- Data for Name: sport_energy_transaction; Type: TABLE DATA; Schema: public; Owner: root
--

COPY sport_energy_transaction (point_transaction_id, point_account_id, point_change, point_status, event_id, create_by, create_time, update_by, update_time, expire_time, external_id, card_number) FROM stdin;
2	18	3000	\N	438293	RFAN27	2018-07-17 15:50:57.795733	\N	\N	2019-12-31 00:00:00	\N	2090537712050
3	18	3000	\N	658293	RFAN27	2018-07-17 15:51:10.848566	\N	\N	2019-12-31 00:00:00	\N	2090537712050
\.


--
-- Data for Name: sport_energy_transaction_detail; Type: TABLE DATA; Schema: public; Owner: root
--

COPY sport_energy_transaction_detail (point_transaction_id, item_code, line_number, quantity, point_change_item, point_status) FROM stdin;
2	834750	1	1	1200	\N
2	834750	2	1	1200	\N
2	8350	3	10	600	\N
\.


--
-- Name: sport_energy_transaction_point_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('sport_energy_transaction_point_transaction_id_seq', 3, true);


SET search_path = voucher, pg_catalog;

--
-- Data for Name: voucher; Type: TABLE DATA; Schema: voucher; Owner: root
--

COPY voucher (voucher_number, pin_code, amount, card_number, activated_status, activated_time, used_status, used_time, validity_days, redeem_id) FROM stdin;
294857984	8934	5	2090537712048	t	2017-10-01 00:00:00	f	\N	25	374895
74982357	3928	5	2090537094	t	2017-10-25 18:17:32.426019	t	2017-10-26 15:15:02.580055	30	\N
\.


--
-- Data for Name: voucher_pool; Type: TABLE DATA; Schema: voucher; Owner: root
--

COPY voucher_pool (voucher_number, pin_code, amount) FROM stdin;
238945792	4933	20
\.


SET search_path = converter, pg_catalog;

--
-- Name: item item_pkey; Type: CONSTRAINT; Schema: converter; Owner: root
--

ALTER TABLE ONLY item
    ADD CONSTRAINT item_pkey PRIMARY KEY (code);


--
-- Name: purchase purchase_pkey; Type: CONSTRAINT; Schema: converter; Owner: root
--

ALTER TABLE ONLY purchase
    ADD CONSTRAINT purchase_pkey PRIMARY KEY (id);


SET search_path = point, pg_catalog;

--
-- Name: point_total point_total_pkey; Type: CONSTRAINT; Schema: point; Owner: root
--

ALTER TABLE ONLY point_total
    ADD CONSTRAINT point_total_pkey PRIMARY KEY (card_number);


SET search_path = public, pg_catalog;

--
-- Name: sport_energy_account card_number_unique; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY sport_energy_account
    ADD CONSTRAINT card_number_unique UNIQUE (card_number);


--
-- Name: sport_energy_account sport_energy_account_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY sport_energy_account
    ADD CONSTRAINT sport_energy_account_pkey PRIMARY KEY (point_account_id);


--
-- Name: sport_energy_transaction sport_energy_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY sport_energy_transaction
    ADD CONSTRAINT sport_energy_transaction_pkey PRIMARY KEY (point_transaction_id);


--
-- PostgreSQL database dump complete
--

