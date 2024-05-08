import clsx from "clsx/lite"

interface TypoProps {
    className?: string,
    variant?: 'primary',
    children?: React.ReactNode,
}

const TYPO_VARIANT = {
    primary: "text-main-primary font-semibold text-lg leading-7"
}

export const Typo = ({ className, variant = "primary", children, ...props }: TypoProps) => {
    return(
        <p className={clsx(className, TYPO_VARIANT[variant], '')} {...props}>{children}</p>
    )
}