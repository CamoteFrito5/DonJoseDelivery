-- ========================================================
-- ESQUEMA DE BASE DE DATOS EN SUPABASE (POSTGRESQL)
-- Restaurant Parrilladas y Pollería DON JOSÉ
-- Asignatura: IS-621 Ingeniería de Software (UNAM)
-- ========================================================

-- 1. TABLA DE PEDIDOS (ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'PENDIENTE', -- PENDIENTE, EN PROCESO, EN CAMINO, RECIBIDO
    ticket_number TEXT DEFAULT '',
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    delivery_type TEXT NOT NULL,     -- tienda, delivery
    delivery_zone_name TEXT,
    address TEXT,
    reference TEXT,
    wants_receipt BOOLEAN DEFAULT FALSE,
    dni TEXT DEFAULT '11111111',
    payment_method TEXT NOT NULL,    -- YAPE, EFECTIVO
    cash_with TEXT,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    taper_count INTEGER DEFAULT 0,
    taper_cost NUMERIC(10, 2) DEFAULT 0,
    bag_cost NUMERIC(10, 2) DEFAULT 0,
    delivery_cost NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL
);

-- 2. TABLA DE PRODUCTOS Y MENÚ (PRODUCTS)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    unit TEXT,
    requires_taper BOOLEAN DEFAULT TRUE,
    taper_count INTEGER DEFAULT 1,
    popular BOOLEAN DEFAULT FALSE,
    is_out_of_stock BOOLEAN DEFAULT FALSE,
    image TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ACTIVAR TIEMPO REAL (WEBSOCKETS REALTIME)
-- Permite que los cambios de estado en cocina o cambios de stock se reflejen
-- instantáneamente en los teléfonos de los clientes sin recargar la página.
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- 4. POLÍTICAS DE ACCESO (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Permitir a clientes leer y crear pedidos
CREATE POLICY "Acceso público lectura pedidos" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Acceso público creación pedidos" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Acceso público actualización pedidos" ON public.orders
    FOR UPDATE USING (true);

-- Permitir a todos leer la carta de productos
CREATE POLICY "Acceso público lectura carta" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Acceso público gestión carta" ON public.products
    FOR ALL USING (true);
