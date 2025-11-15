'use client';

import styled from 'styled-components';
import type { ReactNode } from 'react';

const toneBg = {
  gray: '#f9fafb',
  blue: '#eff6ff',
  green: '#ecfdf5',
  orange: '#fff7ed',
} as const;
type Tone = keyof typeof toneBg;

/* ---- layout ---- */
const Wrap = styled.section`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  gap: 16px;
`;
const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  align-items: start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const Left = styled.div`
  display: grid;
  gap: 12px;
`;
const Right = styled.aside`
  display: grid;
  gap: 12px;
`;
const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
`;
const ImgBox = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background: #f3f4f6;
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;
const Label = styled.div`
  font-size: 13px;
  opacity: 0.7;
  margin-bottom: 6px;
`;
const Badge = styled.span<{ $tone: Tone }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: ${({ $tone }) => toneBg[$tone]};
`;

/* ---- props ---- */
export type ItemForDetails = {
  id: number;
  title: string;
  description: string | null;
  images: string[] | null;
};

export default function ItemDetails({
  item,
  right,
  status,
  statusTone = 'gray',
}: {
  item: ItemForDetails;
  /** optional right-side panel (actions, badges, etc.) */
  right?: ReactNode;
  /** optional status badge (shown above details on the left) */
  status?: string;
  /** tone for the status badge */
  statusTone?: Tone;
}) {
  const firstImage = item.images?.[0];

  return (
    <Wrap>
      <Title>{item.title}</Title>

      <Grid>
        <Left>
          {status && (
            <div>
              <Badge $tone={statusTone as Tone}>{status}</Badge>
            </div>
          )}

          <ImgBox>
            {firstImage ? (
              <img src={firstImage} alt={`${item.title} image`} />
            ) : (
              <span style={{ fontSize: 12, opacity: 0.7 }}>No image</span>
            )}
          </ImgBox>

          <Card>
            <Label>Details</Label>
            <div style={{ whiteSpace: 'pre-wrap' }}>{item.description || 'No description provided.'}</div>
          </Card>
        </Left>

        <Right>{right}</Right>
      </Grid>
    </Wrap>
  );
}
