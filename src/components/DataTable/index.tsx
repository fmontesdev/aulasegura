import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../theme';
import { StyledCard } from '../StyledCard';
import { Pagination } from '../../types/Pagination';
import { DataTableHeader } from './components/DataTableHeader';
import { DataTableFooter } from './components/DataTableFooter';
import { DataTableRow } from './components/DataTableRow';

export interface ColumnConfig<T> {
  key: string;
  label: string;
  flex: number;
  sortable?: boolean;
  sortKey?: keyof T | ((item: T) => string | number);
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  keyExtractor: (item: T) => string;
  renderRow: (item: T) => React.ReactNode;
  isLoading?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
  defaultSortKey?: string;
  defaultSortOrder?: 'asc' | 'desc';
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  renderRow,
  isLoading = false,
  onRefresh,
  emptyMessage = 'No hay datos disponibles',
  defaultSortKey,
  defaultSortOrder = 'asc',
  pagination,
  onPageChange,
  onLimitChange,
  limitOptions = [5, 10, 20, 50],
}: DataTableProps<T>) {
  const theme = useAppTheme();
  const [sortField, setSortField] = useState<string | undefined>(defaultSortKey);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);

  const handleSort = (columnKey: string) => {
    if (sortField === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(columnKey);
      setSortOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField) return data;

    const column = columns.find(col => col.key === sortField);
    if (!column || column.sortable === false) return data;

    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (typeof column.sortKey === 'function') {
        aValue = column.sortKey(a);
        bValue = column.sortKey(b);
      } else if (column.sortKey) {
        aValue = a[column.sortKey];
        bValue = b[column.sortKey];
      } else {
        return 0;
      }

      let compareValue = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        compareValue = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        compareValue = aValue - bValue;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
  }, [data, sortField, sortOrder, columns]);

  return (
    <View style={styles.container}>
      <StyledCard style={styles.tableCard}>
        <FlatList
          data={sortedData}
          keyExtractor={keyExtractor}
          ListHeaderComponent={() => (
            <DataTableHeader
              columns={columns}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          )}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={isLoading}
                onRefresh={onRefresh}
                colors={[theme.colors.secondary]}
              />
            ) : undefined
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <DataTableRow
              item={item}
              borderBottomColor={theme.colors.outlineVariant}
              renderRow={renderRow}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.centered}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                {emptyMessage}
              </Text>
            </View>
          )}
        />
        
        {/* Footer con paginación */}
        {pagination && onPageChange && (
          <DataTableFooter
            pagination={pagination}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
            limitOptions={limitOptions}
          />
        )}
      </StyledCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    padding: 24,
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
  },
  tableCard: {
    margin: 0,
    overflow: 'hidden',
  },
});
