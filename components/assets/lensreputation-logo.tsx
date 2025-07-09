import Image from "next/image";

export const LensReputationLogo = ({ size = 20 }: { size?: number }) => {
  return <Image src="/lensreputation-logo.png" alt="lensreputation.xyz" width={size} height={size} />;
};
