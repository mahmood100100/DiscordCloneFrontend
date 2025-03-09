interface AuthHeaderProps {
    label : string;
    title: string;
    className: string;
}
const AuthHeader = ({label , title , className} : AuthHeaderProps) => {
  return (
    <div className= {`w-full flex flex-col gap-y-4 items-center justify-center ${className}`}>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className=" text-sm">{label}</p>
    </div>
  )
}

export default AuthHeader