import { INITIAL_PRODUCTS } from '../data/products';

const PRODUCTS_STORAGE_KEY = 'donjose_menu_catalog_v3';

export function getStoredCatalog() {
  try {
    const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!data) {
      // Limpiar versiones obsoletas si existiesen
      try {
        localStorage.removeItem('donjose_menu_catalog_v1');
        localStorage.removeItem('donjose_menu_catalog_v2');
      } catch (_) {}
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo catálogo:', error);
    return INITIAL_PRODUCTS;
  }
}

export function saveCatalog(products) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch (error) {
    console.error('Error guardando catálogo:', error);
    return false;
  }
}

export function toggleProductOutOfStock(productId) {
  const products = getStoredCatalog();
  const updated = products.map((p) => {
    if (p.id === productId) {
      return {
        ...p,
        isOutOfStock: !p.isOutOfStock
      };
    }
    return p;
  });
  saveCatalog(updated);
  return updated;
}

export function upsertProduct(product) {
  const products = getStoredCatalog();
  const index = products.findIndex((p) => p.id === product.id);

  let updated;
  if (index >= 0) {
    // Editar existente
    updated = [...products];
    updated[index] = { ...updated[index], ...product };
  } else {
    // Nuevo plato
    const newId = `prod-${Date.now()}`;
    updated = [{ ...product, id: newId, isOutOfStock: false }, ...products];
  }

  saveCatalog(updated);
  return updated;
}

export function deleteProduct(productId) {
  const products = getStoredCatalog();
  const updated = products.filter((p) => p.id !== productId);
  saveCatalog(updated);
  return updated;
}

export function resetCatalogToDefault() {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}
