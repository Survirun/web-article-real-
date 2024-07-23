import { IconButton, Logo, Typo } from "./index"
import { useRouter } from 'next/navigation'

interface HeaderProps {
    isDark?: boolean
}

export const Header = ({isDark = false}: HeaderProps) => {
    const color = isDark ? '#fff' : '#000';
    const bgColor = isDark ? '#000' : '#fff';
    const router = useRouter()
    return(
        <div className="flex w-full sticky justify-center bg-black top-[0] z-10">
            <div className="h-headerH max-w-contentW w-full flex justify-between items-center [&>*]:m-[0rem_1.5rem]">
                <Logo type={isDark ? "light" : "dark"}/>
            </div>
        </div>
    )
}