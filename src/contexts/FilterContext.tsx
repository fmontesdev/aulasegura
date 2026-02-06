import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import { Platform } from 'react-native';

interface FilterContextType {
  filters: string[];
  addFilter: (filter: string) => void;
  removeFilter: (index: number) => void;
  clearFilters: () => void;
}

const defaultContextValue: FilterContextType = {
  filters: [],
  addFilter: () => {},
  removeFilter: () => {},
  clearFilters: () => {},
};

const FilterContext = createContext<FilterContextType>(defaultContextValue);

export function FilterProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useLocalSearchParams();
  
  const [filters, setFilters] = useState<string[]>([]);
  const isUpdatingFromURL = useRef(false);

  // Parsear filtros desde URL
  // En web, lee directamente de window.location para evitar problemas con useLocalSearchParams
  const parseFiltersFromURL = useCallback((): string[] => {
    const filtersParam = Platform.OS === 'web' && typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('filters')
      : searchParams.filters;
    
    if (!filtersParam) return [];
    return String(filtersParam).split(',').filter(Boolean);
  }, [searchParams.filters]);

  // Sincronizar estado desde URL (URL -> Estado)
  // Se ejecuta en: montaje inicial, cambio de ruta
  useEffect(() => {
    const urlFilters = parseFiltersFromURL();
    const filtersMatch = JSON.stringify(urlFilters) === JSON.stringify(filters);
    
    if (!filtersMatch) {
      isUpdatingFromURL.current = true;
      setFilters(urlFilters);
    }
  }, [pathname, parseFiltersFromURL]);

  // Sincronizar URL desde estado (Estado -> URL)
  // Se ejecuta cuando el usuario agrega/quita chips
  // Usa replaceState para no crear entradas en el historial
  useEffect(() => {
    // Si el cambio vino de la URL, no actualizar URL de nuevo (evitar loop)
    if (isUpdatingFromURL.current) {
      isUpdatingFromURL.current = false;
      return;
    }

    const filtersString = filters.length > 0 ? filters.join(',') : undefined;
    
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (filtersString) {
        url.searchParams.set('filters', filtersString);
      } else {
        url.searchParams.delete('filters');
      }
      window.history.replaceState({}, '', url.toString());
    } else {
      router.setParams({ filters: filtersString });
    }
  }, [filters, router]);

  const addFilter = (filter: string) => {
    const trimmed = filter.trim();
    if (trimmed && !filters.includes(trimmed)) {
      setFilters(prev => [...prev, trimmed]);
    }
  };

  const removeFilter = (index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  return (
    <FilterContext.Provider value={{ filters, addFilter, removeFilter, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  return context;
}
