CREATE DATABASE sepe_campo;

\c sepe_campo

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id       uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username varchar NOT NULL UNIQUE,
  password varchar NOT NULL,
  role     varchar
);

CREATE TABLE visitas (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contrato     varchar(100) NOT NULL,
  vereda       varchar(100) NOT NULL,
  municipio    varchar(100) NOT NULL,
  tecnico_id   varchar(100) NOT NULL,
  fecha        date NOT NULL,
  "createdAt"  timestamptz NOT NULL DEFAULT now(),
  "updatedAt"  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE apoyos (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  visita_id      uuid NOT NULL REFERENCES visitas(id),
  numero         int NOT NULL,
  nivel_tension  varchar(50) NOT NULL,
  tipo_poste     varchar(100),
  codigo         varchar(50),
  perchas        int NOT NULL DEFAULT 0,
  templetes_bt   int NOT NULL DEFAULT 0,
  templetes_mt   int NOT NULL DEFAULT 0,
  tierras_bt     int NOT NULL DEFAULT 0,
  tierras_mt     int NOT NULL DEFAULT 0,
  conectores     int NOT NULL DEFAULT 0,
  transformador  boolean NOT NULL DEFAULT false,
  coord_x        decimal(10,2),
  coord_y        decimal(10,2),
  coord_z        decimal(10,2),
  observaciones  text,
  "createdAt"    timestamptz NOT NULL DEFAULT now(),
  "updatedAt"    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE estructuras_apoyos (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  apoyo_id     uuid NOT NULL REFERENCES apoyos(id) ON DELETE CASCADE,
  codigo       varchar(100) NOT NULL,
  cantidad     int NOT NULL,
  "createdAt"  timestamptz NOT NULL DEFAULT now(),
  "updatedAt"  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE usuarios_beneficiarios (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  visita_id      uuid NOT NULL REFERENCES visitas(id),
  nombre         varchar(150),
  num_medidor    varchar(50),
  tipo_medidor   varchar(100),
  acometida      varchar(100),
  observaciones  text,
  "createdAt"    timestamptz NOT NULL DEFAULT now(),
  "updatedAt"    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tramos (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  visita_id         uuid NOT NULL REFERENCES visitas(id),
  apoyo_origen_id   uuid NOT NULL REFERENCES apoyos(id),
  apoyo_destino_id  uuid NOT NULL REFERENCES apoyos(id),
  nivel_tension     varchar(50) NOT NULL,
  longitud_ml       decimal(10,2) NOT NULL,
  observaciones     text,
  "createdAt"       timestamptz NOT NULL DEFAULT now(),
  "updatedAt"       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE inconsistencias (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  visita_id      uuid NOT NULL REFERENCES visitas(id),
  apoyo_id       uuid REFERENCES apoyos(id),
  usuario_id     uuid REFERENCES usuarios_beneficiarios(id),
  tramo_id       uuid REFERENCES tramos(id),
  numero_regla   int NOT NULL,
  descripcion    text NOT NULL,
  mensaje        text NOT NULL,
  severidad      varchar(50) NOT NULL DEFAULT 'INFO',
  "createdAt"    timestamptz NOT NULL DEFAULT now()
);
