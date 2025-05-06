/**
 * svg line type
 * - default value is `straight`
 */
type LineType = 'bezier' | 'straight' | 'step';

/**
 * field item type for `source` and `target`
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FieldItem<T = any> {
  /**
   * field array item key value
   * - `source`: `source-${randomID}`
   * - `target`: `target-${randomID}`
   */
  id: string;

  /**
   * field name
   */
  name: string;

  /**
   * field type
   * - `source` | `target`
   */
  type: 'source' | 'target';

  /**
   * you can handle own data.
   */
  data?: T;
}

/**
 * mapping array item key value
 */
interface Mapping {
  /**
   * mapping array key value
   * - `id`: `mapping-${randomID}`
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldItemInput<T = any> = Omit<FieldItem<T>, 'type' | 'id'>;

interface TableMappingProps {
  /**
   * source field array item
   */
  sources?: FieldItemInput[];

  /**
   * target field array item
   */
  targets?: FieldItemInput[];
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
   * - default value is `2`
   */
  lineWidth?: number;

  /**
   * mapping line hover color
   * - default value is `#ff5722`
   */
  hoverLineColor?: string;

  /**
   * you can custom `source` table style.
   */
  sourceTableStyle?: React.CSSProperties;

  /**
   * you can custom `target` table style.
   */
  targetTableStyle?: React.CSSProperties;

  /**
   * you can custom `table header` style.
   */
  tableHeaderStyle?: React.CSSProperties;

  /**
   * you can custom `table cell` style.
   */
  tableCellStyle?: React.CSSProperties;

  /**
   * you can custom `connector` style.
   */
  connectorStyle?: React.CSSProperties;

  /**
   * if mapping, `onMappingChange` return current Mapping states.
   * @param mappings
   * @returns
   */
  onMappingChange?: (mappings: Mapping[]) => void;
}

export type { TableMappingProps, FieldItem, Mapping, FieldItemInput, LineType };
