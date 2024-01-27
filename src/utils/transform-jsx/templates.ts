export function reactTemplate(variables: any, { tpl }: any) {
  return tpl`
    import { Ref, forwardRef } from "react";

    interface Props {
      color?: string
      size?: 'small' | 'default' | 'large'
    }

    const sizeMapper = {
      small: 16,
      default: 24,
      large: 32
    }

    const ${variables.componentName} = ({
      color = 'black',
      size = 'default',
      ...props
    }: Props, ref: Ref<SVGSVGElement>) => (
      ${variables.jsx}
    )

    ${variables.exports}
  `
}
