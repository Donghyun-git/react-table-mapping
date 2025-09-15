/**
 * svg line type
 * - default value is `straight`
 */
export type LineType = 'bezier' | 'straight' | 'step';

/**
 * source column type
 */
export interface HeaderColumnProps {
  /**
   * column title
   */
  title: string;

  /**
   * column key
   * - matched with `FieldItem.key`
   * - if you want to match with `FieldItem.key`, use `key` props.
   * - can use `sameNameMapping` methods in `useTableMapping` hook.
   */
  key: string;
}

/**
 * other field data
 * - you can custom field component init.
 * - if you want to match with `HeaderColumnProps.key`, use `columnKey` props.
 *
 * `column key`
 * - matched with `FieldItem.key`
 * - if you want to match with `FieldItem.key`, use `key` props.
 * - can use `sameNameMapping` methods in `useTableMapping` hook.
 */
export interface OuterFieldItem {
  [field: string]:
    | {
        type: 'string';
        columnKey: string;
        value: string;
      }
    | {
        type: 'input';
        columnKey: string;
        value?: string;
        defaultValue?: string;
        attributes?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;
        onChange?: (value: string) => void;
      }
    | {
        type: 'select';
        columnKey: string;
        value?: string;
        defaultValue?: string;
        attributes?: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'>;
        options: {
          label: string;
          value: string;
          disabled?: boolean;
        }[];
        onChange?: (value: string) => void;
      }
    | string;
}

/**
 * field item type for `source` and `target`
 */
export interface FieldItem extends Partial<OuterFieldItem> {
  /**
   * field array item key value
   * - `source`: `source-${randomID}`
   * - `target`: `target-${randomID}`
   */
  id: string;

  /**
   * key
   * - matched with `HeaderColumnProps.key`
   */
  key: string;
}

/**
 * mapping array item key value
 */
export interface Mapping {
  /**
   * mapping array key value
   * - `id`: `mapping-${source.id}-${target.id}`
   */
  id: string;

  /**
   * source field id
   */
  source: string;

  /**
   * target field id
   */
  target: string;
}

/**
 * field item without internal properties (for user input)
 */
export type FieldItemInput = Partial<FieldItem>;

export interface TableMappingProps {
  /**
   * source field array item
   */
  sources: FieldItemInput[];

  /**
   * target field array item
   */
  targets: FieldItemInput[];

  /**
   * source column array item
   */
  sourceColumns: Array<Omit<HeaderColumnProps, 'type'>>;

  /**
   * target column array item
   */
  targetColumns: Array<Omit<HeaderColumnProps, 'type'>>;

  /**
   * initial mappings
   * - if you already have mappings, use `initialMappings` props.
   * - you can prerender `TableMapping` component.
   */
  initialMappings?: Mapping[];

  /**
   * - default value is `straight`
   */
  lineType?: LineType;

  /**
   * mapping line color
   * - default value is `#2196F3`
   */
  lineColor?: string;

  /**
   * mapping line width
   * - default value is `1.5`
   */
  lineWidth?: number;

  /**
   * mapping line hover color
   * - default value is `#ff5722`
   */
  hoverLineColor?: string;

  /**
   * disabled mapping and contents
   */
  disabled?: boolean;

  /**
   * no data component
   * - you can custom no data component.
   */
  noDataComponent?: React.ReactNode;

  /**
   * after source field remove
   * @params removeSourceId
   */
  afterSourceFieldRemove?: (removedSourceId: string) => void;

  /**
   * after target field remove
   * @params removeTargetId
   */
  afterTargetFieldRemove?: (removedTargetId: string) => void;

  /**
   * if mapping, `onMappingChange` return current Mapping states.
   * @param mappings
   * @returns
   */
  onMappingChange?: (mappings: Mapping[]) => void;
}
