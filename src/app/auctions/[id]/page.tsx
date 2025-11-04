import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import styled from 'styled-components';
import BidForm from '@/components/BidForm';

const Main = styled.main`
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  gap: 24px;
`;
const H1 = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 0;
`;
const P = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  opacity: 0.85;
  white-space: pre-wrap;
`;
const Box = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  display: grid;
  gap: 6px;
`;
const Label = styled.span`
  font-weight: 600;
`;
const Notice = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
`;

export default async function AuctionDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return <Main>Hibás azonosító.</Main>;

  const session = await auth();

  const auction = await prisma.auction.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      startsAt: true,
      endsAt: true,
      startingPrice: true,
      minIncrement: true,
      currentPrice: true,
      item: { select: { title: true, description: true } },
    },
  });

  if (!auction) return <Main>Nincs ilyen aukció.</Main>;

  const isActive = auction.status === 'ACTIVE';

  return (
    <Main>
      <div>
        <H1>{auction.item.title}</H1>
        <P>{auction.item.description}</P>
      </div>

      <Box>
        <div>
          <Label>Jelenlegi ár:</Label> {auction.currentPrice.toString()}
        </div>
        <div>
          <Label>Minimum lépcső:</Label> {auction.minIncrement.toString()}
        </div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>Lejár: {new Date(auction.endsAt).toLocaleString()}</div>
      </Box>

      {isActive ? (
        session?.user ? (
          <BidForm auctionId={auction.id} minAllowed={(Number(auction.currentPrice) + Number(auction.minIncrement)).toFixed(2)} />
        ) : (
          <Notice>
            A licitáláshoz kérjük{' '}
            <Link href='/auth/login' style={{ textDecoration: 'underline' }}>
              jelentkezz be
            </Link>
            .
          </Notice>
        )
      ) : (
        <Notice>Ez az aukció nem aktív.</Notice>
      )}
    </Main>
  );
}
