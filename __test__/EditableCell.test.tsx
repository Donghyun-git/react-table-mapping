import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import TableMapping from '@/components/TableMapping';
import type { FieldItemInput, Mapping, TableMappingStateWithAction } from '@/types/table-mapping';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeTargets(): FieldItemInput[] {
  return [
    { id: 't1', key: 't1', name: { type: 'input', columnKey: 'name', value: 'A' } },
    { id: 't2', key: 't2', name: { type: 'input', columnKey: 'name', value: 'B' } },
    { id: 't3', key: 't3', name: { type: 'input', columnKey: 'name', value: 'C' } },
  ];
}

function ControlledMapping({ onChangeSpy }: { onChangeSpy?: (s: TableMappingStateWithAction) => void }) {
  const [sources, setSources] = useState<FieldItemInput[]>([
    { id: 's1', key: 's1', name: { type: 'string', columnKey: 'name', value: 'S1' } },
  ]);
  const [targets, setTargets] = useState<FieldItemInput[]>(makeTargets());
  const [mappings, setMappings] = useState<Mapping[]>([]);

  const handleChange = (state: TableMappingStateWithAction) => {
    setSources(state.sources);
    setTargets(state.targets);
    setMappings(state.mappings);
    onChangeSpy?.(state);
  };

  return (
    <TableMapping
      sources={sources}
      targets={targets}
      mappings={mappings}
      sourceColumns={[{ key: 'name', title: 'Name' }]}
      targetColumns={[{ key: 'name', title: 'Name' }]}
      onMappingChange={handleChange}
    />
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('EditableCell', () => {
  it('renders initial values from props', () => {
    render(<ControlledMapping />);
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    const values = inputs.map((i) => i.value);
    expect(values).toContain('A');
    expect(values).toContain('B');
    expect(values).toContain('C');
  });

  it('typing in an input updates displayed value immediately (store-driven, no debounce on display)', () => {
    render(<ControlledMapping />);
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

    act(() => {
      fireEvent.change(inputs[0], { target: { value: 'hello' } });
    });

    expect(inputs[0].value).toBe('hello');
  });

  it('BUG FIX: rapid changes across siblings preserve all values after debounce fires', async () => {
    vi.useFakeTimers();
    render(<ControlledMapping />);
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    const [i1, i2, i3] = inputs;

    // Simulate rapid sequential edits across all three cells.
    act(() => {
      fireEvent.change(i1, { target: { value: 'X' } });
      fireEvent.change(i2, { target: { value: 'Y' } });
      fireEvent.change(i3, { target: { value: 'Z' } });
    });

    expect(i1.value).toBe('X');
    expect(i2.value).toBe('Y');
    expect(i3.value).toBe('Z');

    // Advance past debounce — emit fires → parent setState → new props → echo-aware reconcile.
    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    // All values must survive the echo round-trip.
    expect(i1.value).toBe('X');
    expect(i2.value).toBe('Y');
    expect(i3.value).toBe('Z');

    vi.useRealTimers();
  });

  it('onMappingChange receives UPDATE_TARGET_FIELD_VALUE after debounce', async () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    render(<ControlledMapping onChangeSpy={spy} />);
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

    act(() => {
      fireEvent.change(inputs[0], { target: { value: 'NEW' } });
    });

    expect(spy).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(spy).toHaveBeenCalled();
    const lastCall = spy.mock.calls[spy.mock.calls.length - 1][0] as TableMappingStateWithAction;
    expect(lastCall.action.type).toBe('UPDATE_TARGET_FIELD_VALUE');

    vi.useRealTimers();
  });

  it('external prop change overrides input value', async () => {
    function ExternalControl() {
      const [targets, setTargets] = useState<FieldItemInput[]>(makeTargets());

      return (
        <>
          <button
            onClick={() =>
              setTargets([
                { id: 't1', key: 't1', name: { type: 'input', columnKey: 'name', value: 'EXTERNAL' } },
                ...targets.slice(1),
              ])
            }
          >
            Force
          </button>
          <TableMapping
            sources={[]}
            targets={targets}
            mappings={[]}
            sourceColumns={[{ key: 'name', title: 'Name' }]}
            targetColumns={[{ key: 'name', title: 'Name' }]}
            onMappingChange={(s) => setTargets(s.targets)}
          />
        </>
      );
    }

    render(<ExternalControl />);
    act(() => {
      fireEvent.click(screen.getByText('Force'));
    });

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
      expect(inputs[0].value).toBe('EXTERNAL');
    });
  });
});
