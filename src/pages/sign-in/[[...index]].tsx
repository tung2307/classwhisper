import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";

const SignInPage = () => {
  const router = useRouter();
  const { locale, defaultLocale, query } = router;

  const referrer = Array.isArray(query.index) ? query.index[0] : query.index;

  const signInPath = `${locale === defaultLocale ? "" : "/" + locale}/sign-in`;
  const signUpPath = `${locale === defaultLocale ? "" : "/" + locale}/sign-up`;

  return (
    <div className="mt-16 flex justify-center">
      <SignIn
        path={signInPath}
        signUpUrl={signUpPath}
        redirectUrl={referrer ?? "/"}
      />
    </div>
  );
};

export default SignInPage;
