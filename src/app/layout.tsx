import type { Metadata } from 'next';
import StyledComponentsRegistry from './sc-registry';
import Providers from './providers';
import { auth } from '@/auth';
import Header from '@/components/layout/Header/Header';

export const metadata: Metadata = {
  title: 'Auction App',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const sessionUser = session?.user ? { id: session.user.id, name: session.user.name, role: session.user.role } : null;

  return (
    <html lang='hu'>
      <body>
        <StyledComponentsRegistry>
          <Providers>
            <Header user={sessionUser} />
            {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
