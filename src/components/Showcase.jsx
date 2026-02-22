import Button from './Button';
export default function Showcase() {
  return <>
    <h1>Showcasing components</h1>
    <Button>Click Me!</Button>
    <Button primary>Primary Button</Button>
    <Button secondary>Secondary Button</Button>
    <Button disabled>Disabled Button</Button>
    <Button primary disabled>Primary Disabled Button</Button>
    <Button secondary disabled>Secondary Disabled Button</Button>
    <Button primary large>Large Primary Button</Button>
    <Button secondary large>Large Secondary Button</Button>
    <Button primary small>Small Primary Button</Button>
    <Button secondary small>Small Secondary Button</Button>
    <Button primary large disabled>Large Primary Disabled Button</Button>
    <Button secondary large disabled>Large Secondary Disabled Button</Button>
    <Button primary small disabled>Small Primary Disabled Button</Button>
    <Button secondary small disabled>Small Secondary Disabled Button</Button>
    <Button tertiary>Tertiary Button</Button>
  </>
}