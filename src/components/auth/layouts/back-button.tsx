import Link from "next/link";
import { Button } from "../../ui/button";

interface BackButtonProps {
  href: string;
  label: string;
  className? : string | null;
}
const BackButton = ({href , label , className} : BackButtonProps) => {
  return (
    <Button variant = "link" className= {`w-full font-normal ${className}`} size= "sm" asChild>
      <Link href={href}>
         {label}
      </Link>
    </Button>
  )
}

export default BackButton