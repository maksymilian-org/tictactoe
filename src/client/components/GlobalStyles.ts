import { createGlobalStyle, CSSProp } from 'styled-components';

export interface ThemeProps {
  theme: {
    bgMain: CSSProp;
    colorMain: CSSProp;
  };
}

const GlobalStyles = createGlobalStyle`
  :root {
    --bgMain: ${(props: ThemeProps) => props.theme.bgMain};
    --colorMain: ${(props: ThemeProps) => props.theme.colorMain};
  }
`;

export const lightTheme = {
  bgMain: '#fff',
  colorMain: '#404040'
};

export const darkTheme = {
  bgMain: '#404040',
  colorMain: '#fff'
};

export default GlobalStyles;
