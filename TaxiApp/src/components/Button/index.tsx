import React, {HTMLProps, ReactNode} from 'react';

import useHoverProps from 'hooks/theme/useHoverProps';

import theme from 'tools/theme';

import {
  Pressable,
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {ReactNativeStyle, css} from '@emotion/native';

type ButtonType = 'purple' | 'purple_inset' | 'gray' | 'white';

type ButtonProps = {
  type?: ButtonType;
  disabled?: boolean;
  children?: ReactNode;
  style?: ReactNativeStyle;
  textStyle?: ReactNativeStyle;
  onPressed?: () => void;
};

const Button = ({
  type,
  disabled = false,
  children,
  style,
  textStyle,
  onPressed,
  ...divProps
}: ButtonProps) => {
  const [hoverProps, isHover, isClicked] = useHoverProps();

  const getColor = () => {
    switch (type) {
      case 'purple':
        return {
          backgroundColor: disabled
            ? theme.purple_disabled
            : isHover
            ? theme.purple_dark
            : theme.purple,
          boxShadow:
            isClicked && !disabled ? theme.shadow_clicked : theme.shadow,
        };
      case 'purple_inset':
        return {
          backgroundColor: disabled
            ? theme.purple_disabled
            : isHover
            ? theme.purple_dark
            : theme.purple,
          boxShadow: theme.shadow_purple_button_inset,
        };
      case 'gray':
        return {
          backgroundColor: isHover ? theme.gray_line : theme.gray_background,
          boxShadow: theme.shadow_gray_button_inset,
        };
      case 'white':
        return {
          backgroundColor: isHover ? theme.purple_hover : theme.white,
          boxShadow:
            isClicked && !disabled ? theme.shadow_clicked : theme.shadow,
        };
    }
  };
  const getTextColor = () => {
    switch (type) {
      case 'purple':
        return {
          color: theme.white,
        };
      case 'purple_inset':
        return {
          color: theme.white,
        };
      case 'gray':
        return {
          color: isHover ? theme.white : theme.gray_text,
          fontWeight: isHover ? 500 : undefined,
        };
      case 'white':
        return {
          color: theme.purple,
        };
    }
  };

  const styles = css`
    transition-duration: ${theme.duration};
    ...${getColor()};
  `; //TODO: theme cursor 처리

  const textStyles = css`
    textAlign: center;
    ...${getTextColor()};
  `;

  return (
    <Pressable
      style={[style, styles]}
      onPress={disabled ? undefined : onPressed}
      {...hoverProps}
      {...divProps}>
      <Text style={[textStyles, textStyle]}>{children}</Text>
    </Pressable>
  );
};

export default Button;
