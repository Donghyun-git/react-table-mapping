/**
 * svg line type
 * - default value is `straight`
 */
type LineType = 'bezier' | 'straight' | 'step';

/**
 * source column type
 */
interface HeaderColumnProps {
  title: string;
  key: string;
}

/**
 * field item type for `source` and `target`
 */
interface FieldItem {
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
   * key
   * - matched with `HeaderColumnProps.key`
   */
  key: string;
}

/**
 * mapping array item key value
 */
interface Mapping {
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
type FieldItemInput = Omit<FieldItem, 'id' | 'key'>;

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
   * source column array item
   */
  sourceColumns?: Array<Omit<HeaderColumnProps, 'type'>>;

  /**
   * target column array item
   */
  targetColumns?: Array<Omit<HeaderColumnProps, 'type'>>;

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
