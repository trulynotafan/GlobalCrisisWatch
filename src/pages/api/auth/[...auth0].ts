import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
import { auth0Config } from '@/utils/auth0-config';

export default handleAuth({
  login: handleLogin({
    returnTo: '/dashboard'
  })
}); 