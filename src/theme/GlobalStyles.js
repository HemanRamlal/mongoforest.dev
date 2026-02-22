import {createGlobalStyle} from 'styled-components';
import themes from './schema.json';
export const GlobalStyles = createGlobalStyle`
  :root {
  /* 
    /* Primary color palette - uncomment when ready to use */
    --primary-color: ${({theme}) => theme.color.a.brand};
    --primary-color-ts : ${({theme}) => theme.color.a["text-strong"]};
    --primary-color-tw : ${({theme}) => theme.color.a["text-weak"]};
    --primary-color-ss : ${({theme}) => theme.color.a["stroke-strong"]};
    --primary-color-sw : ${({theme}) => theme.color.a["stroke-weak"]};
    --primary-color-fill : ${({theme}) => theme.color.a["fill"]};
    --primary-color-anti-brand : ${({theme}) => theme.color.a["anti-brand"]};
    /**/
    /* Secondary color palette - uncomment when ready to use */
    --secondary-color: ${({theme}) => theme.color.b.brand};
    --secondary-color-ts : ${({theme}) => theme.color.b["text-strong"]};
    --secondary-color-tw : ${({theme}) => theme.color.b["text-weak"]};
    --secondary-color-ss : ${({theme}) => theme.color.b["stroke-strong"]};
    --secondary-color-sw : ${({theme}) => theme.color.b["stroke-weak"]};
    --secondary-color-fill : ${({theme}) => theme.color.b["fill"]};
    --secondary-color-anti-brand : ${({theme}) => theme.color.b["anti-brand"]};
    /**/

    /* Monochrome palette for grayscale layout development */
    /*
    --primary-color : ${({theme}) => theme.color.mc.brand};
    --primary-color-ts : ${({theme}) => theme.color.mc["text-strong"]};
    --primary-color-tw : ${({theme}) => theme.color.mc["text-weak"]};
    --primary-color-ss : ${({theme}) => theme.color.mc["stroke-strong"]};
    --primary-color-sw : ${({theme}) => theme.color.mc["stroke-weak"]};
    --primary-color-fill : ${({theme}) => theme.color.mc["fill"]};
    --primary-color-anti-brand : ${({theme}) => theme.color.mc["anti-brand"]};
    /**/
    
    /*
    --secondary-color : ${({theme}) => theme.color.mc.brand};
    --secondary-color-ts : ${({theme}) => theme.color.mc["text-strong"]};
    --secondary-color-tw : ${({theme}) => theme.color.mc["text-weak"]};
    --secondary-color-ss : ${({theme}) => theme.color.mc["stroke-strong"]};
    --secondary-color-sw : ${({theme}) => theme.color.mc["stroke-weak"]};
    --secondary-color-fill : ${({theme}) => theme.color.mc["fill"]};
    --secondary-color-anti-brand : ${({theme}) => theme.color.mc["anti-brand"]};
    /**/

    --monochrome-color-pure : ${({theme}) => theme.color.mc.pure};
    --monochrome-color : ${({theme}) => theme.color.mc.brand};
    --monochrome-color-ts : ${({theme}) => theme.color.mc["text-strong"]};
    --monochrome-color-tw : ${({theme}) => theme.color.mc["text-weak"]};
    --monochrome-color-ss : ${({theme}) => theme.color.mc["stroke-strong"]};
    --monochrome-color-sw : ${({theme}) => theme.color.mc["stroke-weak"]};
    --monochrome-color-fill : ${({theme}) => theme.color.mc["fill"]};
    --monochrome-color-anti-brand : ${({theme}) => theme.color.mc["anti-brand"]};

    /* Combined font shorthand variables */
    --font-xxs: ${({theme}) => themes.global.font.xxs.size}px/${({theme}) => themes.global.font.xxs.lineHeight};
    --font-xs: ${({theme}) => themes.global.font.xs.size}px/${({theme}) => themes.global.font.xs.lineHeight};
    --font-sm: ${({theme}) => themes.global.font.sm.size}px/${({theme}) => themes.global.font.sm.lineHeight};
    --font-md: ${({theme}) => themes.global.font.md.size}px/${({theme}) => themes.global.font.md.lineHeight};
    --font-lg: ${({theme}) => themes.global.font.lg.size}px/${({theme}) => themes.global.font.lg.lineHeight};
    --font-xl: ${({theme}) => themes.global.font.xl.size}px/${({theme}) => themes.global.font.xl.lineHeight};
    --font-xxl: ${({theme}) => themes.global.font.xxl.size}px/${({theme}) => themes.global.font.xxl.lineHeight};
    --font-xxxl: ${({theme}) => themes.global.font.xxxl.size}px/${({theme}) => themes.global.font.xxxl.lineHeight};
    --font-xxxxl: ${({theme}) => themes.global.font.xxxxl.size}px/${({theme}) => themes.global.font.xxxxl.lineHeight};
    --font-xxxxxl: ${({theme}) => themes.global.font.xxxxxl.size}px/${({theme}) => themes.global.font.xxxxxl.lineHeight};

    --dimension-xxs: ${({theme}) => themes.global.dimension.xxs}px;
    --dimension-xs: ${({theme}) => themes.global.dimension.xs}px;
    --dimension-sm: ${({theme}) => themes.global.dimension.sm}px;
    --dimension-md: ${({theme}) => themes.global.dimension.md}px;
    --dimension-lg: ${({theme}) => themes.global.dimension.lg}px; 
    --dimension-xl: ${({theme}) => themes.global.dimension.xl}px;
    --dimension-xxl: ${({theme}) => themes.global.dimension.xxl}px;


    /* Shadow values using object format */
    --shadow-raised: ${({theme}) => `${themes.global.shadow.raised.x}px ${themes.global.shadow.raised.y}px ${themes.global.shadow.raised.blur}px ${themes.global.shadow.raised.spread}px ${themes.global.shadow.raised.color}`};
    --shadow-elevated: ${({theme}) => `${themes.global.shadow.elevated.x}px ${themes.global.shadow.elevated.y}px ${themes.global.shadow.elevated.blur}px ${themes.global.shadow.elevated.spread}px ${themes.global.shadow.elevated.color}`};
  }
`;