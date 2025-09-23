
USE testdbTerminal;
drop table if exists schemas;
drop table if exists templates;

drop table if exists infotherminal_schema;

drop table if exists user_login;
drop table if exists infotherminals; 

drop table if exists error_logs;




CREATE TABLE infotherminals (
    id INT NOT NULL IDENTITY(1,1),
    titel VARCHAR(50),
    ipAdresse VARCHAR(50),
    CONSTRAINT PK_infotherminals PRIMARY KEY (id)
);

INSERT INTO infotherminals (titel, ipAdresse) VALUES
('KantineOG', '0.0.0.0'),
('Aula', '0.0.0.1'),
('KantineELG', '0.0.0.2'),
('Empfang', '0.0.0.3'),
('Begegnungshaus', '0.0.0.4'),
('localhost', '127.0.0.1'),
('test', '10.1.11.8');

CREATE TABLE schemas (
    id INT NOT NULL IDENTITY(1,1),
    imagePath VARCHAR(255),
    selectedTime VARCHAR(50),
    isAktiv VARCHAR(1),
    startTime VARCHAR(50),
    endTime VARCHAR(50),
    startDateTime VARCHAR(50),
    endDateTime VARCHAR(50),
    timeAktiv VARCHAR(1),
    dateAktiv VARCHAR(1), 
    titel VARCHAR(50),
    beschreibung VARCHAR(255),
    CONSTRAINT PK_schemas PRIMARY KEY (id) 
);

CREATE table templates (
    id INT NOT NULL IDENTITY(1,1),
    fk_schema_id INT NOT NULL,
    templateName VARCHAR(50),
    typ VARCHAR(50),
    inhalt VARCHAR(255),
    CONSTRAINT FK_templates_schemas FOREIGN KEY (fk_schema_id)
        REFERENCES schemas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE infotherminal_schema (
    id INT NOT NULL IDENTITY(1,1),
    fk_infotherminal_id INT NOT NULL,
    fk_schema_id INT NOT NULL,
    CONSTRAINT PK_infotherminal_schema PRIMARY KEY (fk_infotherminal_id, fk_schema_id),
    CONSTRAINT FK_infotherminal_schema_infotherminals FOREIGN KEY (fk_infotherminal_id) 
        REFERENCES infotherminals(id),
    CONSTRAINT FK_infotherminal_schema_schemas FOREIGN KEY (fk_schema_id) 
        REFERENCES schemas(id)
);


SELECT templates.
 *FROM schemas
RIGHT JOIN templates ON templates.fk_schema_id = schemas.id
where templates.fk_schema_id = 3;



CREATE TABLE user_login (
    id INT IDENTITY(1,1) PRIMARY KEY, -- Bleibt int für Auto-Inkrement
    username VARCHAR(50),
    password VARCHAR(255), -- Gehashte Passwörter
    remember_me VARCHAR(1) DEFAULT '1', -- '1' = Angemeldet bleiben, '0' = Nein
    is_admin VARCHAR(1) DEFAULT '0', -- '1' = Admin, '0' = Normaler User
    is_active VARCHAR(1) DEFAULT '1', -- '1' = Aktiv, '0' = Deaktiviert
    email VARCHAR(100),
    failed_attempts VARCHAR(10) DEFAULT '0', -- Anzahl als String
    last_failed_attempt VARCHAR(50), -- Datum als String (z.B. '2023-10-01 12:00:00')
    lockout_until VARCHAR(50), -- Datum als String
    last_login VARCHAR(50), -- Datum als String
    verification_code VARCHAR(10), -- Für Passwort-Reset
    verification_expires DATETIME, -- Ablaufdatum als echtes DATETIME
    created_at DATETIME DEFAULT GETDATE(), -- Erstellungsdatum im Format yyyy-mm-dd hh:mi:ss
 );



CREATE TABLE error_logs (
        message VARCHAR(255) NOT NULL, -- Fehler-Nachricht
        datum DATETIME DEFAULT GETDATE(), -- Aktuelles Datum und Zeit
);


