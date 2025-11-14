import { BtnCancel, Main } from './layout.styles';

export default function SingleItemLayout({ children }: { children: React.ReactNode }) {
  return (
    <Main>
      {children}
      <BtnCancel href='/items'>Cancel</BtnCancel>
    </Main>
  );
}
