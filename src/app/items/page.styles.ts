'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { ItemStatus } from './page';

export const Main = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  gap: 16px;
`;
export const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 0;
`;
export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;
export const AddBtn = styled(Link)`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  &:hover {
    background: #f8fafc;
  }
`;
export const List = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
`;
export const Row = styled.li`
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 12px;
  align-items: center;
`;
export const Thumb = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  display: grid;
  place-items: center;
  font-size: 12px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;
export const ItemTitle = styled.p`
  font-weight: 600;
`;
export const Meta = styled.div`
  font-size: 13px;
  opacity: 0.8;
  margin-top: 2px;
`;
export const Badge = styled.span<{ $tone: ItemStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: ${({ $tone }) => ({ DRAFT: '#f9fafb', LISTED: '#eff6ff', SOLD: '#ecfdf5', UNSOLD: '#fff7ed' }[$tone])};
`;
export const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;
export const Btn = styled(Link)`
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  &:hover {
    background: #f8fafc;
  }
`;
export const SmallBtn = styled.button`
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  &:hover {
    background: #f8fafc;
  }
`;
