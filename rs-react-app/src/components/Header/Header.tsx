import Image from 'next/image'

export default function Header() {
  return (
  <Image className="logo" src="/rick_and_morty_logo.png" alt="Logo" width={622} height={202}/>
  )
}
