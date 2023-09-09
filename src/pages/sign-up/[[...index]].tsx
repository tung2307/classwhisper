import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/router";

const SignUpPage = () => {
  const { locale, defaultLocale } = useRouter();
  return (
    <>
      <div className="mt-16 flex  justify-center">
        <SignUp
          path={`${locale === defaultLocale ? "" : "/" + locale}/sign-in`}
          signInUrl={`${locale === defaultLocale ? "" : "/" + locale}/sign-up
`}
          redirectUrl={"/"}
        />
      </div>
    </>
  );
};
export default SignUpPage;
