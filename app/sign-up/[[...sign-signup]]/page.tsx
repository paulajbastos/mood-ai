import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <SignUp forceRedirectUrl="/new-user" signInForceRedirectUrl="/new-user" />
  );
}
