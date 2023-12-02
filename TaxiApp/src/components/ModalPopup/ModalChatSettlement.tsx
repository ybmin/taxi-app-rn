import {useMemo, useRef, useState} from 'react';
import {View, Text, TextStyle} from 'react-native';
import {css} from '@emotion/native';

import useSendMessage from 'hooks/chat/useSendMessage';
import {useEvent2023FallQuestComplete} from 'hooks/event/useEvent2023FallQuestComplete';
import {useValueRecoilState} from 'hooks/useFetchRecoilState';
import {useAxios} from 'hooks/useTaxiAPI';

import Button from 'components/Button';
import DottedLine from 'components/DottedLine';
import InputAcount from 'components/Input/InputAccount';
import Modal from 'components/Modal';

import alertAtom from 'atoms/alert';
import {useSetRecoilState} from 'recoil';

import regExpTest from 'tools/regExpTest';
import theme from 'tools/theme';

import Icons from 'react-native-vector-icons/MaterialIcons';

type ModalChatSettlementProps = Omit<
  Parameters<typeof Modal>[0],
  'padding' | 'children' | 'onEnter'
> & {
  roomInfo: Room;
  onRecall?: () => void;
  openSaveAccountModal?: (account: string) => void;
};

const ModalChatSettlement = ({
  roomInfo,
  onRecall,
  openSaveAccountModal,
  ...modalProps
}: ModalChatSettlementProps) => {
  const axios = useAxios();
  const setAlert = useSetRecoilState(alertAtom);
  const {account: defaultAccount} = useValueRecoilState('loginInfo') || {};
  const [account, setAccount] = useState<string>(defaultAccount || '');
  const isValidAccount = useMemo(() => regExpTest.account(account), [account]);
  const isRequesting = useRef<boolean>(false);
  const sendMessage = useSendMessage(roomInfo._id, isRequesting);
  const event2023FallQuestComplete = useEvent2023FallQuestComplete();

  const onClickOk = () => {
    if (isRequesting.current || !isValidAccount) return;
    isRequesting.current = true;
    axios({
      url: '/rooms/commitPayment',
      method: 'post',
      data: {roomId: roomInfo._id},
      onSuccess: async () => {
        isRequesting.current = false;
        onRecall?.();
        if (account !== '') {
          await sendMessage('account', {text: account});
          isRequesting.current = false;
          if (account !== defaultAccount) openSaveAccountModal?.(account);
        }
        //#region event2023Fall
        event2023FallQuestComplete('payingAndSending');
        event2023FallQuestComplete('sending');
        //#endregion
        modalProps.onChangeIsOpen?.(false);
      },
      onError: () => {
        isRequesting.current = false;
        setAlert('정산하기를 실패했습니다.');
      },
    });
  };

  //theme.font18
  const styleTitle = css`
    display: 'flex';
    alignitems: 'center';
    margin: '0 8px 12px';
  `;
  const styleIcon = css`
    fontSize: '21px',
    margin: '0 4px 0 0',
  `;
  //theme.font12
  const styleText = css`
    color: ${theme.gray_text};
    margin: '0 8px 12px';
  `;
  //theme.font14
  const styleAccount = css`
    margin: '12px 8px',
    display: 'flex',
    alignItems: 'center',
    color: ${theme.gray_text},
    whiteSpace: 'nowrap',
    `;
  const styleButtons = css`
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  `;
  //theme.font12
  const styleAlarm = css`
    color: ${theme.gray_text},
    margin: '0 8px 12px',
  `;

  return (
    <Modal {...modalProps} padding="16px 12px 12px" onEnter={onClickOk}>
      <View style={styleTitle}>
        <Icons name="account-balance-wallet" style={styleIcon} />
        <Text style={[styleTitle, {...(theme.font18 as TextStyle)}]}>
          정산하기
        </Text>
      </View>
      <Text style={styleText}>동승자들에게 송금을 요청할 수 있습니다.</Text>
      <Text style={styleText}>
        <Text>• 완료 후 취소는 </Text>
        <Text style={{fontWeight: 'bold'}}>불가능</Text>
        <Text>{`합니다.
        `}</Text>
        <Text style={{color: theme.red_text}}>
          • 본인이 택시 요금을 계산한 경우에만 진행해주세요.
        </Text>
      </Text>
      <DottedLine />
      <View style={styleAccount}>
        <Text style={styleAccount}>계좌번호</Text>
        <InputAcount
          value={account}
          onChangeValue={setAccount}
          style={css`
            width: '100%';
            marginleft: '10px';
          `}
        />
      </View>
      {isValidAccount ? (
        account === '' ? (
          <Text style={{...styleAlarm, color: theme.gray_text}}>
            • 계좌번호를 공유하지 않고 정산 요청을 합니다.
          </Text>
        ) : (
          <Text style={{...styleAlarm, color: theme.gray_text}}>
            • 정산 요청과 함께 계좌번호를 채팅창에 전송합니다.
          </Text>
        )
      ) : (
        <Text style={{...styleAlarm, color: theme.red_text}}>
          • 올바른 계좌번호를 입력해주세요.
        </Text>
      )}
      <View style={styleButtons}>
        <Button
          type="gray"
          style={css`
            width: 'calc(50% - 5px)';
            padding: '10px 0 9px';
            borderradius: '8px';
          `}
          textStyle={{...(theme.font14 as TextStyle)}}
          onPressed={() => modalProps.onChangeIsOpen?.(false)}>
          돌아가기
        </Button>
        <Button
          type="purple_inset"
          style={css`
            width: 'calc(50% - 5px)',
            padding: '10px 0 9px',
            borderRadius: '8px',
          `}
          textStyle={{...(theme.font14 as TextStyle)}}
          onPressed={onClickOk}
          disabled={!isValidAccount}>
          완료하기
        </Button>
      </View>
    </Modal>
  );
};

export default ModalChatSettlement;
