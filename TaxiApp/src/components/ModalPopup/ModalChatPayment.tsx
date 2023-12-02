import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {Text, View, TextStyle} from 'react-native';
import {css} from '@emotion/native';

import useAccountFromChats from 'hooks/chat/useAccountFromChats';
import {useEvent2023FallQuestComplete} from 'hooks/event/useEvent2023FallQuestComplete';
import {useValueRecoilState} from 'hooks/useFetchRecoilState';
import {useAxios} from 'hooks/useTaxiAPI';

import Button from 'components/Button';
import ButtonShare from 'components/Button/ButtonShare';
import DottedLine from 'components/DottedLine';
// import LinkCopy from 'components/Link/LinkCopy';
// import LinkPayment from 'components/Link/LinkPayment';
import Modal from 'components/Modal';

import alertAtom from 'atoms/alert';
import {useSetRecoilState} from 'recoil';

import theme from 'tools/theme';

import Icons from 'react-native-vector-icons/MaterialIcons';
// import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import LocalAtmRoundedIcon from "@mui/icons-material/LocalAtmRounded";
import {ReactComponent as KakaoPayLogo} from 'static/assets/serviceLogos/KakaoPayLogo.svg';
import {ReactComponent as TossLogo} from 'static/assets/serviceLogos/TossLogo.svg';

type ModalChatPaymentProps = Omit<
  Parameters<typeof Modal>[0],
  'padding' | 'children' | 'onEnter'
> & {
  roomInfo: Room;
  onRecall?: () => void;
  account: ReturnType<typeof useAccountFromChats>;
};

const ModalChatPayment = ({
  roomInfo,
  account,
  onRecall,
  ...modalProps
}: ModalChatPaymentProps) => {
  const axios = useAxios();
  const setAlert = useSetRecoilState(alertAtom);
  const {oid: userOid} = useValueRecoilState('loginInfo') || {};
  const isRequesting = useRef<boolean>(false);
  const [isCopied, setIsCopied] = useState(false);
  const settlementStatusForMe = useMemo(
    () =>
      roomInfo &&
      roomInfo.part.filter(user => user._id === userOid)?.[0]?.isSettlement,
    [userOid, roomInfo],
  );
  const onCopy = useCallback(() => setIsCopied(true), [setIsCopied]);
  //#region event2023Fall
  const event2023FallQuestComplete = useEvent2023FallQuestComplete();
  //#endregion

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const onClickOk = async () => {
    if (isRequesting.current) return;
    isRequesting.current = true;
    await axios({
      url: '/rooms/commitSettlement',
      method: 'post',
      data: {roomId: roomInfo._id},
      onSuccess: () => {
        //#region event2023Fall
        event2023FallQuestComplete('payingAndSending');
        event2023FallQuestComplete('paying');
        //#endregion
        modalProps.onChangeIsOpen?.(false);
        onRecall?.();
      },
      onError: () => setAlert('송금하기를 실패하였습니다.'),
    });
    isRequesting.current = false;
  };

  const styleTitle = css`{
    ...theme.font18,
    display: "flex",
    alignItems: "center",
    margin: "0 8px 12px",
  }`;
  const styleIcon = css` {
    fontSize: "21px",
    margin: "0 4px 0 0",
  }`;
  const styleText = css` {
    ...theme.font12
    color: theme.gray_text,
    margin: "0 8px 12px",
  }`;
  const styleAccount = css` {
    ...theme.font14,
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    margin: "0 8px 12px",
    color: theme.gray_text,
  }`;

  const CheckRoundedIcon = (
    <Icons name="check" size={16} color={theme.gray_text} />
  );
  const ContentCopyIcon = (
    <Icons name="content-copy" size={16} color={theme.gray_text} />
  );
  const LocalAtmRoundedIcon = (
    <Icons name="local-atm" size={16} color={theme.gray_text} />
  );

  return (
    <Modal {...modalProps} padding="16px 12px 12px" onEnter={onClickOk}>
      <View style={styleTitle}>
        {LocalAtmRoundedIcon}
        <Text style={styleTitle}>송금하기</Text>
      </View>
      {account && (
        <>
          <Text style={styleText}>
            택시비 결제자의 계좌번호를 참고하시어 송금해 주세요. 결제 방법 선택
            시에 해당 앱으로 이동합니다.
          </Text>
          <Text style={styleAccount}>
            {' '}
            {/*selectable*/}
            계좌번호
            <Text style={{}}>{account}</Text>
          </Text>
          <View
            style={css`{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "12px",
            }`}>
            <LinkCopy value={account} onCopy={onCopy}>
              <ButtonShare
                text="계좌 복사"
                icon={isCopied ? CheckRoundedIcon : ContentCopyIcon}
                background={theme.gray_background}
              />
            </LinkCopy>
            <LinkPayment type="kakaopay" account={account}>
              <ButtonShare
                text="카카오페이"
                icon={<KakaoPayLogo style={{width: '22px'}} />}
                background="#FFEB00"
              />
            </LinkPayment>
            <LinkPayment type="toss" account={account}>
              <ButtonShare
                text="토스"
                icon={<TossLogo style={{width: '24px'}} />}
                background="#0050FF"
              />
            </LinkPayment>
          </View>
          <DottedLine />
          <View
            style={css`
               {
                height: '12px';
              }
            `}
          />
        </>
      )}
      <Text style={styleText}>
        <Text>택시비 결제자에게 송금 후</Text>
        <Text style={{fontWeight: 'bold'}}>송금 확인</Text>
        <Text>버튼을 눌러주세요.</Text>
      </Text>
      <Text style={styleText}>
        <Text>• 완료 후 취소는 </Text>
        <Text style={{fontWeight: 'bold'}}>불가능</Text>
        <Text>{`합니다.
        `}</Text>
        {/*change line */}
        <Text style={{color: theme.red_text}}>
          • 결제자에게 금액을 송금한 경우에만 진행해주세요.
        </Text>
      </Text>
      <View
        style={css`{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
        }`}>
        <Button
          type="gray"
          style={css`
            width: 'calc(50% - 5px)';
            padding: '10px 0 9px';
            borderradius: '8px';
          `}
          textStyle={{
            ...(theme.font14_bold as TextStyle),
          }}
          onPressed={() => modalProps.onChangeIsOpen?.(false)}>
          돌아가기
        </Button>
        <Button
          type="purple_inset"
          style={css`
            width: "calc(50% - 5px)",
            padding: "10px 0 9px",
            borderRadius: "8px",
            ...theme.font14_bold,
          `}
          onPressed={onClickOk}
          disabled={settlementStatusForMe !== 'send-required'}>
          {settlementStatusForMe === 'send-required'
            ? '송금 확인'
            : settlementStatusForMe === 'sent'
            ? '송금 확인 완료'
            : '송금 확인 불가능'}
        </Button>
      </View>
    </Modal>
  );
};

export default ModalChatPayment;
