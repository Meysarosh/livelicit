import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';

import ItemDetails, { type ItemForDetails } from '@/components/item/ItemDetails';
import { Panel, H, Meta, Actions, Btn, SmallBtn } from './page.styles';

/* ---- derived status helpers (same logic as list) ---- */
type ItemStatus = 'DRAFT' | 'LISTED' | 'SOLD' | 'UNSOLD';
function deriveStatus(a?: {
  id: number;
  status: 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELED';
  winnerBidId: number | null;
}): ItemStatus {
  if (!a) return 'DRAFT';
  if (a.status === 'SCHEDULED' || a.status === 'ACTIVE') return 'LISTED';
  if (a.status === 'ENDED') return a.winnerBidId ? 'SOLD' : 'UNSOLD';
  return 'UNSOLD'; // canceled
}
function statusTone(s: ItemStatus) {
  switch (s) {
    case 'DRAFT':
      return 'gray';
    case 'LISTED':
      return 'blue';
    case 'SOLD':
      return 'green';
    case 'UNSOLD':
      return 'orange';
  }
}

export const dynamic = 'force-dynamic';

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect(`/auth/login?callbackUrl=/items/${params.id}`);
  const ownerId = Number(session.user.id);

  const itemId = (await params).id;

  const id = Number(itemId);
  if (!Number.isFinite(id)) notFound();

  const data = await prisma.item.findFirst({
    where: { id, ownerId },
    select: {
      id: true,
      title: true,
      description: true,
      images: true,
      auction: {
        orderBy: { endsAt: 'desc' },
        take: 1,
        select: { id: true, status: true, winnerBidId: true, endsAt: true },
      },
    },
  });

  if (!data) notFound();

  const lastAuction = data.auction[0];
  const s = deriveStatus(lastAuction);
  const tone = statusTone(s) as 'gray' | 'blue' | 'green' | 'orange';

  const item: ItemForDetails = {
    id: data.id,
    title: data.title,
    description: data.description,
    images: data.images,
  };

  const rightPanel = (
    <Panel>
      <H>Item #{data.id}</H>
      <Meta>
        Status: <strong>{s}</strong>
        {lastAuction && (
          <>
            {' • '}Auction: #{lastAuction.id} ({lastAuction.status.toLowerCase()})
          </>
        )}
      </Meta>

      <Actions>
        <Btn href={`/items/${data.id}/edit`}>Edit</Btn>

        {s === 'DRAFT' && (
          <>
            <Btn href={`/auctions/create?itemId=${data.id}`}>Create auction</Btn>
            {/* Optional: allow delete if never auctioned — server action required */}
            {/* <SmallBtn formAction={...}>Delete</SmallBtn> */}
          </>
        )}

        {s === 'LISTED' && lastAuction?.status === 'SCHEDULED' && (
          <>
            <Btn href={`/auctions/${lastAuction.id}`}>View auction</Btn>
            {/* TODO: server action to cancel schedule */}
            <SmallBtn disabled title='Coming soon'>
              Cancel schedule
            </SmallBtn>
          </>
        )}

        {s === 'LISTED' && lastAuction?.status === 'ACTIVE' && (
          <>
            <Btn href={`/auctions/${lastAuction.id}`}>View auction</Btn>
            <Btn href={`/auctions/${lastAuction.id}/request-stop`}>Request stop</Btn>
          </>
        )}

        {s === 'UNSOLD' && <Btn href={`/auctions/create?itemId=${data.id}`}>Re-auction</Btn>}

        {s === 'SOLD' && (
          <>
            <Btn href={`/items/${data.id}/copy`}>Make copy</Btn>
            {lastAuction && <Btn href={`/auctions/${lastAuction.id}`}>View auction</Btn>}
          </>
        )}
      </Actions>
    </Panel>
  );

  return <ItemDetails item={item} status={s} statusTone={tone} right={rightPanel} />;
}
