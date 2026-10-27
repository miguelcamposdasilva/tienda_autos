-- Datos de prueba para el catálogo (usados en Docker y en las pruebas de carga JMeter)
SET NAMES utf8mb4;
USE db_tienda_autos;

INSERT IGNORE INTO autos (id, marca, modelo, annio, precio, stock, imagen, descripcion) VALUES
(1, 'Toyota',  'Corolla Sedán Ejecutivo', 2024,  18990000, 5, '/sedan_ejecutivo.webp',   'Sedán ejecutivo, automático, ideal para ciudad.'),
(2, 'Hyundai', 'Santa Fe SUV Familiar',   2023,  29990000, 3, '/suv_familiar.jpg',       'SUV de 7 asientos para la familia.'),
(3, 'Ford',    'Ranger 4x4',              2024,  32490000, 4, '/camioneta_4_4.jpg',      'Camioneta 4x4 doble cabina.'),
(4, 'Ferrari', 'Roma',                    2022, 250000000, 1, '/deportivo_ferrari.webp', 'Deportivo de alto rendimiento.'),
(5, 'Toyota',  'Prius Híbrido',           2024,  24990000, 6, '/hibrido_ecologico.webp', 'Híbrido de bajo consumo.');
