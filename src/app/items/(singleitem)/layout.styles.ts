'use client';

import Link from 'next/link';
import styled from 'styled-components';

export const Main = styled.main`
  max-width: 640px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  gap: 16px;
`;

export const BtnCancel = styled(Link)`
  text-align: center;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fd7474ff;
  &:hover {
    background: #ff0000;
  }
`;
