import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { Main, Title, List, Card, Row, ItemTitle, Meta, Button } from './page.styles';

interface IAuction {
  id: number;
  item: {
    title: string;
  };
  endsAt: Date;
  currentPrice: Prisma.Decimal;
}

export const dynamic = 'force-dynamic';

export default async function AuctionsPage() {
  const auctions = await prisma.auction.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { endsAt: 'asc' },
    select: {
      id: true,
      endsAt: true,
      currentPrice: true,
      item: { select: { title: true } },
    },
  });

  return (
    <Main>
      <Title>Aktív aukciók</Title>
      <List>
        {auctions.map((a) => (
          <Card key={a.id}>
            <Row>
              <div>
                <ItemTitle>{a.item.title}</ItemTitle>
                <Meta>
                  Jelenlegi ár: {a.currentPrice.toString()} • Lejár: {new Date(a.endsAt).toLocaleString()}
                </Meta>
              </div>
              <Button href={`/auctions/${a.id}`}>Részletek</Button>
            </Row>
          </Card>
        ))}
        {auctions.length === 0 && <Meta>Nincs aktív aukció.</Meta>}
      </List>
    </Main>
  );
}
