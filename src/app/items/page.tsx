import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import ItemsToolbar from './ui/ItemsToolbar';
import {
  Actions,
  AddBtn,
  Badge,
  Btn,
  List,
  Main,
  Meta,
  Row,
  SmallBtn,
  Thumb,
  Title,
  TopBar,
  ItemTitle,
} from './page.styles';
//TODO: replace with next/image
import Image from 'next/image';
import { SEARCH_MIN_CHARS } from '@/lib/search/constants';

const itemsSelectForItemsPage = {
  id: true,
  title: true,
  images: true,
  auction: {
    orderBy: { endsAt: 'desc' },
    take: 1,
    select: { id: true, status: true, winnerBidId: true, endReason: true, endsAt: true },
  },
} as const;

type TypeItemsSelectForItemsPage = Prisma.ItemGetPayload<{
  select: typeof itemsSelectForItemsPage;
}>;

export type ItemStatus = 'DRAFT' | 'LISTED' | 'SOLD' | 'UNSOLD';

function deriveStatus(item: TypeItemsSelectForItemsPage): ItemStatus {
  const a = item.auction[0];
  if (!a) return 'DRAFT';
  if (a.status === 'SCHEDULED' || a.status === 'ACTIVE') return 'LISTED';
  if (a.status === 'ENDED') return a.winnerBidId ? 'SOLD' : 'UNSOLD';
  return 'UNSOLD';
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v ?? '');
// const all = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login?callbackUrl=/items');
  const ownerId = Number(session.user.id);

  const resolvedSearchParams = await searchParams;
  const rawQuery = first(resolvedSearchParams.q).trim();
  const query = rawQuery.length >= SEARCH_MIN_CHARS ? rawQuery : '';
  const statusFilter = (first(resolvedSearchParams.status) || 'all').toLowerCase();

  const items = await prisma.item.findMany({
    where: {
      ownerId,
      ...(query ? { title: { contains: query, mode: 'insensitive' } } : {}),
    },
    select: itemsSelectForItemsPage,
    orderBy: { id: 'desc' },
  });

  const enriched: (TypeItemsSelectForItemsPage & { _status: ItemStatus })[] = items.map((item) => ({
    ...item,
    _status: deriveStatus(item),
  }));

  const filtered = enriched.filter((item) =>
    statusFilter === 'all' ? true : item._status.toLowerCase() === statusFilter
  );

  return (
    <Main>
      <TopBar>
        <Title>My items</Title>
        <AddBtn href='/items/create'>Add new item</AddBtn>
      </TopBar>

      <ItemsToolbar q={query} status={statusFilter} />

      <List>
        {filtered.map((item: TypeItemsSelectForItemsPage & { _status: ItemStatus }) => {
          const lastAuction = item.auction[0];
          const derivedStatus = item._status;
          return (
            <Row key={item.id}>
              <Thumb>{item.images?.length ? <img src={item.images[0]} alt='' /> : <span>No image</span>}</Thumb>

              <div>
                <ItemTitle>
                  {item.title}
                  <Btn href={`/items/${item.id}`}>View details</Btn>
                </ItemTitle>
                <Meta>
                  ID: {item.id} • <Badge $tone={derivedStatus}>{derivedStatus}</Badge>
                  {lastAuction ? (
                    <>
                      s • Last auction: #{lastAuction.id} ({lastAuction.status.toLowerCase()})
                    </>
                  ) : (
                    <> • Never auctioned</>
                  )}
                </Meta>
              </div>

              <Actions>
                <Btn href={`/items/${item.id}/edit`}>Edit</Btn>

                {derivedStatus === 'DRAFT' && (
                  <>
                    <Btn href={`/auctions/create?itemId=${item.id}`}>Create auction</Btn>
                    <SmallBtn>Delete</SmallBtn>
                  </>
                )}

                {derivedStatus === 'LISTED' && (
                  <>
                    <Btn href={`/auctions/${lastAuction.id}`}>View auction</Btn>
                    {lastAuction?.status === 'ACTIVE' && (
                      <>
                        <Btn href={`/auctions/${lastAuction.id}`}>View auction</Btn>
                        <Btn href={`/auctions/${lastAuction.id}/request-stop`}>Request stop</Btn>
                      </>
                    )}
                    {lastAuction?.status === 'SCHEDULED' && (
                      <>
                        <SmallBtn disabled title='Cancel schedule'>
                          Cancel schedule
                        </SmallBtn>
                      </>
                    )}
                  </>
                )}

                {derivedStatus === 'UNSOLD' && (
                  <>
                    <Btn href={`/auctions/create?itemId=${item.id}`}>Re-auction</Btn>
                  </>
                )}

                {derivedStatus === 'SOLD' && (
                  <>
                    <Btn href={`/items/create?copy=${item.id}`}>Make copy</Btn>
                    <Btn href={`/auctions/${lastAuction.id}`}>View auction</Btn>
                  </>
                )}
              </Actions>
            </Row>
          );
        })}
        {filtered.length === 0 && (
          <li style={{ listStyle: 'none', fontSize: 13, opacity: 0.8 }}>No items found. Try changing the filters.</li>
        )}
      </List>
    </Main>
  );
}
