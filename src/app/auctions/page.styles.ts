'use client';
import styled from 'styled-components';
import Link from 'next/link';

export const Main = styled.main`
  max-width: 768px;
  margin: 0 auto;
  padding: 24px;
`;
export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px;
`;
export const Card = styled.li`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  list-style: none;
`;
export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;
export const ItemTitle = styled.div`
  font-weight: 600;
`;
export const Meta = styled.div`
  font-size: 13px;
  opacity: 0.8;
  margin-top: 2px;
`;
export const Button = styled(Link)`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: background 0.15s;
  &:hover {
    background: #f8fafc;
  }
`;
export const List = styled.ul`
  display: grid;
  gap: 12px;
  padding: 0;
`;
