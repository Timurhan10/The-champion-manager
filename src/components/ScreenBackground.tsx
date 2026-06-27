import { ReactNode } from 'react';

interface Props {
  image: string;
  children: ReactNode;
  className?: string;
}

export default function ScreenBackground({ image, children, className = '' }: Props) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url('./${image}')` }}
    >
      <div className="absolute inset-0 bg-black/75" />
      <div className={`relative z-10 ${className}`}>
        {children}
      </div>
    </div>
  );
}
