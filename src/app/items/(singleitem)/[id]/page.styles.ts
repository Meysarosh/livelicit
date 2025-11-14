'use client';

import styled from 'styled-components';
import Link from 'next/link';

/* ---- small UI bits ---- */
export const Panel = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  display: grid;
  gap: 10px;
`;
export const H = styled.h2`
  margin: 0;
  font-size: 16px;
`;
export const Meta = styled.div`
  font-size: 13px;
  opacity: 0.8;
`;
export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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
