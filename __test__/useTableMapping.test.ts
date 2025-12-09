import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useTableMapping from '@/hooks/useTableMapping';
import type { FieldItemInput, Mapping } from '@/types/table-mapping';

describe('Test useTableMapping', () => {
  const mockOnMappingChange = vi.fn();

  const defaultEmptyPropsFromTableMapping = {
    sources: [] as FieldItemInput[],
    targets: [] as FieldItemInput[],
    mappings: [] as Mapping[],
    onStateChange: mockOnMappingChange,
  };

  beforeEach(() => {
    mockOnMappingChange.mockClear();
  });

  describe('1. Set TableMapping Component State', () => {
    it('1-1. Initial All Empty State', () => {
      const { result } = renderHook(() => useTableMapping(defaultEmptyPropsFromTableMapping));

      const api = result.current;

      expect(api.getSourceFields()).toEqual([]);
      expect(api.getTargetFields()).toEqual([]);
      expect(api.getMappings()).toEqual([]);

      expect(mockOnMappingChange).not.toHaveBeenCalled();
    });

    it('1-2. Existing Source Fields', () => {
      const { result } = renderHook(() =>
        useTableMapping({
          ...defaultEmptyPropsFromTableMapping,
          sources: [{ id: 'source-1', key: 'field1' }] as FieldItemInput[],
        }),
      );

      const api = result.current;

      expect(api.getSourceFields()).toEqual([{ id: 'source-1', key: 'field1' }]);
      expect(api.getTargetFields()).toEqual([]);
      expect(api.getMappings()).toEqual([]);

      expect(mockOnMappingChange).not.toHaveBeenCalled();
    });

    it('1-3. Existing Target Fields', () => {
      const { result } = renderHook(() =>
        useTableMapping({
          ...defaultEmptyPropsFromTableMapping,
          targets: [{ id: 'target-1', key: 'field1' }] as FieldItemInput[],
        }),
      );

      const api = result.current;

      expect(api.getSourceFields()).toEqual([]);
      expect(api.getTargetFields()).toEqual([{ id: 'target-1', key: 'field1' }]);
    });

    it('1-4. Existing Mappings', () => {
      const { result } = renderHook(() =>
        useTableMapping({
          ...defaultEmptyPropsFromTableMapping,
          mappings: [{ id: 'mapping-1', source: 'source-1', target: 'target-1' }] as Mapping[],
        }),
      );

      const api = result.current;

      expect(api.getSourceFields()).toEqual([]);
      expect(api.getTargetFields()).toEqual([]);
      expect(api.getMappings()).toEqual([{ id: 'mapping-1', source: 'source-1', target: 'target-1' }]);

      expect(mockOnMappingChange).not.toHaveBeenCalled();
    });

    it('1-5. Existing Source and Target Fields', () => {
      const { result } = renderHook(() =>
        useTableMapping({
          ...defaultEmptyPropsFromTableMapping,
          sources: [{ id: 'source-1', key: 'field1' }] as FieldItemInput[],
          targets: [{ id: 'target-1', key: 'field1' }] as FieldItemInput[],
        }),
      );

      const api = result.current;

      expect(api.getSourceFields()).toEqual([{ id: 'source-1', key: 'field1' }]);
      expect(api.getTargetFields()).toEqual([{ id: 'target-1', key: 'field1' }]);
      expect(api.getMappings()).toEqual([]);

      expect(mockOnMappingChange).not.toHaveBeenCalled();
    });

    it('1-6. Existing Source, Target Fields and Mappings', () => {
      const { result } = renderHook(() =>
        useTableMapping({
          ...defaultEmptyPropsFromTableMapping,
          sources: [{ id: 'source-1', key: 'field1' }] as FieldItemInput[],
          targets: [{ id: 'target-1', key: 'field1' }] as FieldItemInput[],
          mappings: [{ id: 'mapping-1', source: 'source-1', target: 'target-1' }] as Mapping[],
        }),
      );

      const api = result.current;

      expect(api.getSourceFields()).toEqual([{ id: 'source-1', key: 'field1' }]);
      expect(api.getTargetFields()).toEqual([{ id: 'target-1', key: 'field1' }]);
      expect(api.getMappings()).toEqual([{ id: 'mapping-1', source: 'source-1', target: 'target-1' }]);

      expect(mockOnMappingChange).not.toHaveBeenCalled();
    });
  });

  describe('2. useTableMapping Methods', () => {
    const initialProps = {
      sources: [{ id: 'source-1', key: 'field1' }] as FieldItemInput[],
      targets: [{ id: 'target-1', key: 'field1' }] as FieldItemInput[],
      mappings: [] as Mapping[],
      onStateChange: mockOnMappingChange,
    };

    const existAllState = renderHook(() =>
      useTableMapping({
        ...initialProps,
        mappings: [{ id: 'mapping-1', source: 'source-1', target: 'target-1' }] as Mapping[],
      }),
    );

    const onlyEmptySources = renderHook(() =>
      useTableMapping({
        ...initialProps,
        sources: [],
      }),
    );

    const onlyEmptyTargets = renderHook(() =>
      useTableMapping({
        ...initialProps,
        targets: [],
      }),
    );

    const onlyEmptyMappings = renderHook(() =>
      useTableMapping({
        ...initialProps,
        mappings: [],
      }),
    );

    it('2-1. Method [ addMapping ]', () => {
      const { result } = onlyEmptySources;

      const api = result.current;

      api.addMapping('source-1', 'target-1');

      expect(mockOnMappingChange).toHaveBeenCalledTimes(1);
      expect(mockOnMappingChange).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.objectContaining({
            type: 'ADD_MAPPING',
            payload: expect.objectContaining({
              sourceId: 'source-1',
              targetId: 'target-1',
            }),
          }),
        }),
      );
    });

    it('2-2. Method [ appendSource ]', () => {
      const { result } = onlyEmptySources;

      const api = result.current;

      api.appendSource({
        id: '1',
        key: '1',
        name: 'test-field',
      });

      expect(mockOnMappingChange).toHaveBeenCalledTimes(1);

      expect(mockOnMappingChange).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.objectContaining({
            type: 'APPEND_SOURCE',
            payload: expect.objectContaining({
              source: expect.objectContaining({
                id: '1',
                key: '1',
                name: 'test-field',
              }),
            }),
          }),
        }),
      );
    });

    it('2-3. Method [ appendTarget ]', () => {
      const { result } = onlyEmptyTargets;

      const api = result.current;

      expect(api.getTargetFields()).toEqual([]);

      api.appendTarget({
        id: '1',
        key: '1',
        name: 'target-field',
      });

      expect(mockOnMappingChange).toHaveBeenCalledTimes(1);

      expect(mockOnMappingChange).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.objectContaining({
            type: 'APPEND_TARGET',
            payload: expect.objectContaining({
              target: expect.objectContaining({
                id: '1',
                key: '1',
                name: 'target-field',
              }),
            }),
          }),
        }),
      );
    });

    it('2-4. Method [ clearMappings ]', () => {
      const { result } = onlyEmptyMappings;

      const api = result.current;

      api.clearMappings();

      expect(mockOnMappingChange).toHaveBeenCalledTimes(1);
      expect(mockOnMappingChange).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.objectContaining({
            type: 'CLEAR_MAPPINGS',
          }),
          mappings: [],
        }),
      );
    });

    it('2-5. Method [ getMappings ]', () => {
      const { result } = existAllState;

      const api = result.current;

      expect(api.getMappings()).toEqual([{ id: 'mapping-1', source: 'source-1', target: 'target-1' }]);

      expect(mockOnMappingChange).not.toHaveBeenCalled();
    });

    it('2-6. Method [ getSourceFields ]', () => {
      const { result } = existAllState;

      const api = result.current;

      const apiFromSourceFields = api.getSourceFields();
      const sourceFields = api.sourceFields;

      const isEqual = apiFromSourceFields.every((source) => sourceFields.includes(source));

      expect(isEqual).toBe(true);
    });

    it('2-7. Method [ getTargetFields ]', () => {
      const { result } = existAllState;

      const api = result.current;

      const apiFromTargetFields = api.getTargetFields();
      const targetFields = api.targetFields;

      const isEqual = apiFromTargetFields.every((target) => targetFields.includes(target));

      expect(isEqual).toBe(true);
    });

    it('2-8. Method [ getMappings ]', () => {
      const { result } = existAllState;

      const api = result.current;

      const apiFromMappings = api.getMappings();
      const mappings = api.mappings;

      const isEqual = apiFromMappings.every((mapping) => mappings.includes(mapping));

      expect(isEqual).toBe(true);
    });

    it('2-9. Method [ redraw ] & Variable [ redrawCount ]', async () => {
      const { result } = renderHook(() => useTableMapping(defaultEmptyPropsFromTableMapping));

      expect(result.current.redrawCount).toBe(0);

      for (let i = 0; i <= 5; i++) {
        result.current.redraw();

        await waitFor(() => {
          expect(result.current.redrawCount).toBe(i + 1);
        });
      }
    });

    it('2-10. Method [ removeSource ]', () => {
      const { result } = existAllState;

      const api = result.current;

      api.removeSource('source-1');

      expect(mockOnMappingChange).toHaveBeenCalledTimes(1);
      expect(mockOnMappingChange).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.objectContaining({
            type: 'REMOVE_SOURCE',
            payload: expect.objectContaining({
              sourceId: 'source-1',
            }),
          }),
        }),
      );
    });

    it('2-12. Method [ removeTarget ]', () => {
      const { result } = existAllState;

      const api = result.current;

      api.removeTarget('target-1');

      expect(mockOnMappingChange).toHaveBeenCalledTimes(1);
      expect(mockOnMappingChange).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.objectContaining({
            type: 'REMOVE_TARGET',
            payload: expect.objectContaining({
              targetId: 'target-1',
            }),
          }),
        }),
      );
    });

    it('2-13. Method [ removeMapping ]', () => {
      const { result } = existAllState;

      const api = result.current;

      api.removeMapping('mapping-1');

      expect(mockOnMappingChange).toHaveBeenCalledTimes(1);

      expect(mockOnMappingChange).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.objectContaining({
            type: 'REMOVE_MAPPING',
            payload: expect.objectContaining({
              mappingId: 'mapping-1',
            }),
          }),
        }),
      );
    });

    it('2-14. Method [ ');
  });
});
