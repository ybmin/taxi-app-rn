import {useCallback, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-native';
import {useRecoilValue} from 'recoil';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextStyle,
  useColorScheme,
  View,
} from 'react-native';

import {css} from '@emotion/native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import Button from 'components/Button';
import AdaptiveDiv from 'components/AdaptiveDiv';
import theme from 'tools/theme';

import LinkLogin from 'components/Link/LinkLogin';
import loginInfoAtom from 'atoms/loginInfo';
import TaxiLogo from 'static/assets/sparcsLogos/TaxiLogo.svg';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // const navigate = useNavigate();
  // const {search} = useLocation();
  // const userId = useRecoilValue(loginInfoAtom);

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(search);
  //   const redirectPath = searchParams.get('redirect');

  //   // 이미 로그인 되어 있는 경우, 홈페이지로 이동합니다.
  //   if (userId) navigate(redirectPath || '/');
  // }, [userId, search]);

  // const onClickBack = useCallback(() => {
  //   navigate(-1);
  // }, [navigate]);

  const style = css`
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
  `;
  const styleLogo = css`
    height: 54px;
    margin-bottom: 16px;
  `;
  //theme.font20
  const styleTitle = css`
    color: ${theme.black};
    margin-bottom: 12px;
  `;
  const styleMessage = css`
    ${theme.font12};
    color: ${theme.gray_text};
    margin-bottom: 24px;
    text-align: center;
  `;

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={style}>
        <TaxiLogo width={210} height={54} />
        <View style={{height: 16}} />
        {/*이거 간격 어케 하지..*/}
        <Text style={[styleTitle, {...(theme.font20 as TextStyle)}]}>
          로그인 후 이용 가능한 서비스입니다.
        </Text>
        <Text style={styleMessage}>
          <Text>
            세션 만료로 로그아웃이 되었거나, 잘못된 페이지 접근입니다. {'\n'}
            로그인 후 이용해주세요.
          </Text>
        </Text>
        <View
          style={css`
            display: flex;
            gap: 12px;
          `}>
          <AdaptiveDiv
            type="butterfly"
            left={
              <Button
                type="white"
                style={css`
                  padding: 13px 24px 14px;
                  border-radius: 12px;
                `}
                textStyle={{...(theme.font14 as TextStyle)}}
                // onPressed={onClickBack}>
              >
                이전 페이지
              </Button>
            }
            right={
              <Button
                type="purple"
                style={css`
                  padding: 13px 24px 14px;
                  border-radius: 12px;
                `}
                textStyle={{...(theme.font14_bold as TextStyle)}}>
                로그인
              </Button>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default App;
