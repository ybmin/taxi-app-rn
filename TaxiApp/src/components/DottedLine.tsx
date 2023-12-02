import theme from 'tools/theme';

import {View} from 'react-native';
import {css} from '@emotion/native';

type Direction = 'row' | 'column';

type LineProps = {
  direction?: Direction;
  margin?: Exclude<
    Margin,
    `${PixelValue}` | `${PixelValue} ${PixelValue} ${PixelValue} ${PixelValue}`
  >;
};

const DottedLine = ({
  direction = 'row',
  margin = '0 0px',
  ...divProps
}: LineProps) => {
  const wrapper = css`
    height: direction === "row" ? '1px' : undefined;
    width:
      direction === "row"
        ? calc(100%${
          margin ? ' - 2 * ' + margin.toString().split(' ')[1] + 'px' : ''
        })
        : 1px;
    margin: direction === "row" ? ${margin} : undefined;
  `;
  const line = css`
    height: ${direction} === "row" ? undefined : calc(100% + 4px);
    width: ${direction} === "row" ? calc(100% + 4px) : undefined;
    borderTop:
      ${direction} === "row" ? 5px dotted ${theme.gray_line} : undefined,
    marginLeft: ${direction} === "row" ? -2px : undefined;
    borderLeft:
      ${direction} === "column" ? '5px dotted ${theme.gray_line}' : undefined;
    marginTop: ${direction} === "column" ? -2px : undefined;
  `;

  return (
    <View
      style={css`
      ...${wrapper}; 
      overflow: hidden;
      boxSizing: border-box;
      `}
      {...divProps}>
      <View style={line} />
    </View>
  );
};

export default DottedLine;
