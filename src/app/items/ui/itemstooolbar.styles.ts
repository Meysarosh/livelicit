'use client';

import styled from 'styled-components';

export const Bar = styled.form`
  display: grid;
  grid-template-columns: 1fr 180px 120px;
  gap: 8px;
`;
export const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
`;
export const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
`;
export const Btn = styled.button`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  &:hover {
    background: #f8fafc;
  }
`;
