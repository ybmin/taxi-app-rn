import Modal from 'components/Modal';

import BodyCallTaxi from './Body/BodyCallTaxi';

import theme from 'tools/theme';

import {Text, TextStyle, View} from 'react-native';

import {css} from '@emotion/native';

// import LocalTaxiRoundedIcon from "@mui/icons-material/LocalTaxiRounded";
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

type ModalCallTaxiProps = Omit<
  Parameters<typeof Modal>[0],
  'padding' | 'children'
> & {roomInfo: Room};

const ModalCallTaxi = ({roomInfo, ...modalProps}: ModalCallTaxiProps) => {
  const styleTitle = css`
    display: flex;
    align-items: center;
    margin: 0 8px 12px;
  `;

  const styleIcon = css`
    font-size: 21px;
    margin: 0 4px 0 0;
  `;

  return (
    <Modal {...modalProps} padding="16px 12px 12px">
      <Text style={[styleTitle, theme.font18 as TextStyle]}>
        <Icons name="taxi" style={styleIcon} />
        택시 호출하기
      </Text>
      <BodyCallTaxi roomInfo={roomInfo} />
    </Modal>
  );
};

export default ModalCallTaxi;
export {ModalCallTaxi};
