import Image from "next/image";

export const HeyLogo = ({ size = 20 }: { size?: number }) => {
  return <Image src="/hey-logo.png" alt="Hey.xyz" width={size} height={size} />;
};
