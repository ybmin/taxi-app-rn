import {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {useDelayBoolean} from 'hooks/useDelay';
import useDisableScrollEffect from 'hooks/useDisableScrollEffect';
import useKeyboardOperationEffect from 'hooks/useKeyboardOperationEffect';

import AdaptiveDiv from 'components/AdaptiveDiv';

import theme from 'tools/theme';

import {css} from '@emotion/native';
import {Pressable, View} from 'react-native';

import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

export type ModalElemProps = {
  isOpen: boolean;
  onChangeIsOpen?: (isOpen: boolean) => void;
  onEnter?: () => void;
  displayCloseBtn?: boolean;
  width?: number;
  padding?: Padding;
  backgroundChildren?: ReactNode;
  children?: ReactNode;
  isAlert?: boolean;
};

const ModalElem = ({
  isOpen,
  onChangeIsOpen,
  onEnter,
  displayCloseBtn = true,
  width = theme.modal_width,
  padding = '0px',
  backgroundChildren,
  children,
  isAlert = false,
}: ModalElemProps) => {
  const [display, setDisplay] = useState(false);
  const shouldMount = useDelayBoolean(isOpen, theme.duration_num);
  const modalRef = useRef(null);
  const clickRef = useRef(false);

  const closeHandler = onChangeIsOpen ? () => onChangeIsOpen(false) : () => {};
  const onPressIn = ({nativeEvent}: {nativeEvent: any}) => {
    if (modalRef.current) {
      const {locationX, locationY} = nativeEvent;
      (modalRef.current as any).measure(
        (
          fx: number,
          fy: number,
          width: number,
          height: number,
          px: number,
          py: number,
        ) => {
          // Check if the touch is outside the modal
          if (
            locationX < px ||
            locationX > px + width ||
            locationY < py ||
            locationY > py + height
          ) {
            clickRef.current = true;
          }
        },
      );
    }
  };

  const onPressOut = () => {
    if (clickRef.current) {
      closeHandler();
    }
    clickRef.current = false;
  };

  useDisableScrollEffect(isOpen);
  useKeyboardOperationEffect({
    onEnter: isOpen ? onEnter : undefined,
    onEscape: isOpen ? closeHandler : undefined,
  });
  useEffect(() => {
    setDisplay(shouldMount && isOpen);
  }, [shouldMount, isOpen]);

  const styleBgd = css`{
    position: "fixed" as any;
    display: "flex";
    top: "0px";
    left: "0px";
    width: "100%";
    height: "calc(100% + 1px)"; // useDisableScrollEffect 로 감소된 1px을 보정
    zIndex: isAlert ? theme.zIndex_alert : theme.zIndex_modal;
    background: isAlert ? theme.black_40 : theme.black_60;
    opacity: display ? 1 : 0;
    transition: 'opacity ${theme.duration} ease-in-out';
    pointerEvents: (isOpen ? "auto" : "none") as any;
  }`;
  const styleBody = css`
     {
      position: 'relative' as any;
      background: ${theme.white};
      borderradius: '15px';
      padding: padding;
      minheight: '148px';
      maxheight: '720px';
      display: 'flex';
      flexdirection: 'column' as any;
      boxsizing: 'border-box' as any;
    }
  `;
  const styleBtn = css`
    color: ${theme.gray_text};
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
  `;

  if (!shouldMount) return null;
  return (
    <Pressable
      style={styleBgd}
      onPressIn={() => onPressIn}
      onPressOut={() => onPressOut}>
      {backgroundChildren}
      <AdaptiveDiv type="modal" width={width}>
        <View style={styleBody}>
          {children}
          {displayCloseBtn && (
            <Icons name="close" style={styleBtn} onPress={() => closeHandler} />
          )}
        </View>
      </AdaptiveDiv>
    </Pressable>
  );
};

export default ModalElem;
