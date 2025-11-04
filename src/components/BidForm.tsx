'use client';
import { useState, FormEvent } from 'react';
import styled from 'styled-components';
import { Prisma } from '@prisma/client';

const Form = styled.form`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  display: grid;
  gap: 10px;
`;
const Title = styled.div`
  font-weight: 600;
`;
const Hint = styled.div`
  font-size: 13px;
  opacity: 0.8;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Input = styled.input`
  width: 160px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
`;
const Btn = styled.button<{ disabled?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? '#f3f4f6' : 'white')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: background 0.15s;
  &:hover {
    background: #f8fafc;
  }
`;
const Msg = styled.div`
  font-size: 14px;
`;

export default function BidForm(props: {
  auctionId: number;
  minAllowed: string;
}) {
  const [amount, setAmount] = useState(props.minAllowed);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/bid', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          auctionId: props.auctionId,
          amount: new Prisma.Decimal(amount), // Decimal string
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.error || 'Licit hiba.');
      } else {
        setMsg('Sikeres licit!');
        location.reload(); // később WS frissítés
      }
    } catch {
      setMsg('Hálózati hiba.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <Title>Licitálás</Title>
      <Hint>Minimum ajánlható összeg: {props.minAllowed}</Hint>
      <Row>
        <Input
          type='number'
          step='0.01'
          min={props.minAllowed}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Btn disabled={busy}>{busy ? 'Küldés...' : 'Licitálok'}</Btn>
      </Row>
      {msg && <Msg>{msg}</Msg>}
    </Form>
  );
}
