const SvgLineExtractor = ({
  type,
  startX,
  startY,
  endX,
  endY,
}: {
  type: LineType;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}) => {
  switch (type) {
    case 'bezier': {
      const controlPointOffset = (endX - startX) / 2;

      return `M ${startX} ${startY} C ${
        startX + controlPointOffset
      } ${startY}, ${endX - controlPointOffset} ${endY}, ${endX} ${endY}`;
    }

    case 'straight':
      return `M ${startX} ${startY} L ${endX - 7} ${endY}`;

    case 'step': {
      const midX = startX + (endX - startX) / 2;

      return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
    }

    default:
      return `M ${startX} ${startY} L ${endX - 7} ${endY}`;
  }
};

export default SvgLineExtractor;
