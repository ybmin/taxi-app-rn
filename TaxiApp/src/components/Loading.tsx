import {css, keyframes} from '@emotion/react';

import {Text, TextStyle, StyleProp} from 'react-native';

import theme, {Font} from 'tools/theme';

type LoadingProps = {
  center?: boolean;
  font?: StyleProp<TextStyle>;
  color?: string;
};

const Loading = ({
  center,
  font = theme.font16,
  color = theme.purple,
}: LoadingProps) => {
  const text = css`
    :after {
      color: ${color};
      content: 'Loading 🚕';
      animation: ${keyframes`
      25% {
        content: "Loading. 🚕";
      }
      50% {
        content: "Loading.. 🚕";
      }
      75% {
        content: "Loading... 🚕";
      }`} 1.5s linear infinite;
    }
  `;
  const positionCenter = css`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `;

  return <Text style={[text, center && positionCenter]} />;
};

export default Loading;
