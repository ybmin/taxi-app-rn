import {Link, useLocation} from 'react-router-native';
import {StyleProp, ViewStyle} from 'react-native';

import {backServer, deviceType} from 'tools/loadenv';

type LinkLoginProps = {
  children: React.ReactNode;
  redirect?: string;
};

const LinkLogin = ({children, redirect}: LinkLoginProps) => {
  const {pathname, search} = useLocation();
  const redirectPath = redirect || pathname + search;

  return (
    <Link
      to={`${backServer}/auth/sparcssso?redirect=${encodeURIComponent(
        redirectPath,
      )}${deviceType.startsWith('app/') ? '&isApp=true' : ''}`}
      style={{textDecoration: 'none'} as StyleProp<ViewStyle>}>
      {children}
    </Link>
  );
};

export default LinkLogin;
