import {useEffect, useState} from 'react';

import type {Report} from 'types/report';

import Modal from 'components/Modal';

import BodyChatReportDone from './Body/BodyChatReportDone';
import BodyChatReportSelectType from './Body/BodyChatReportSelectType';
import BodyChatReportSelectUser from './Body/BodyChatReportSelectUser';

import theme from 'tools/theme';

import {css} from '@emotion/native';

import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text, TextStyle} from 'react-native';
// import ReportGmailerrorredRoundedIcon from "@mui/icons-material/ReportGmailerrorredRounded";

type ModalChatReportProps = Omit<
  Parameters<typeof Modal>[0],
  'padding' | 'children' | 'onEnter'
> & {roomInfo: Room; userOid?: string};

const ModalChatReport = ({
  roomInfo,
  userOid,
  ...modalProps
}: ModalChatReportProps) => {
  const [reportedId, setReportedId] =
    useState<Nullable<Report['reportedId']>>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (userOid && roomInfo.part.find(user => user._id === userOid)) {
      setReportedId(userOid);
      setIsSubmitted(false);
    } else {
      setReportedId(undefined);
      setIsSubmitted(false);
    }
  }, [roomInfo, userOid, modalProps.isOpen]);

  const styleTitle = css`
    display: 'flex';
    alignitems: 'center';
    margin: '0 8px 12px';
  `;

  const styleIcon = css`
    fontsize: '21px';
    margin: '0 4px 0 0';
  `;
  const ReportGmailerrorredRoundedIcon = (
    <Icons name="report-gmailerrorred" style={styleIcon} />
  );

  return (
    <Modal {...modalProps} padding="16px 12px 12px">
      {ReportGmailerrorredRoundedIcon}
      <Text style={[styleTitle, theme.font18 as TextStyle]}>신고하기</Text>
      {!reportedId ? (
        <BodyChatReportSelectUser
          roomInfo={roomInfo}
          setReportedId={setReportedId}
          onChangeIsOpen={modalProps?.onChangeIsOpen}
        />
      ) : !isSubmitted ? (
        <BodyChatReportSelectType
          roomInfo={roomInfo}
          reportedId={reportedId}
          clearReportedId={() => setReportedId(undefined)}
          setIsSubmitted={setIsSubmitted}
        />
      ) : (
        <BodyChatReportDone onChangeIsOpen={modalProps?.onChangeIsOpen} />
      )}
    </Modal>
  );
};

export default ModalChatReport;
