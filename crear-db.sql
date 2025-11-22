-- Conectar a la base de datos lab07db
\c lab07db;

-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
                                        id BIGSERIAL PRIMARY KEY,
                                        nombre VARCHAR(100) NOT NULL,
                                        email VARCHAR(100) UNIQUE NOT NULL,
                                        telefono VARCHAR(20),
                                        ciudad VARCHAR(50)
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
                                         id BIGSERIAL PRIMARY KEY,
                                         nombre VARCHAR(100) NOT NULL,
                                         descripcion VARCHAR(255),
                                         precio NUMERIC(10,2) NOT NULL,
                                         stock INTEGER NOT NULL
);

-- Crear tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedores (
                                           id BIGSERIAL PRIMARY KEY,
                                           nombre VARCHAR(100) NOT NULL,
                                           contacto VARCHAR(100),
                                           telefono VARCHAR(20),
                                           email VARCHAR(100),
                                           direccion VARCHAR(200)
);
