import Sidebar from "./RootComponents/Sidebar"
import LeftSection from "./RootComponents/LeftSection"
import RightSection from "./RootComponents/RightSection"
export default function Root() {
  return (
    <main className="flex h-screen text-white">
      <Sidebar className="w-[80px] bg-background1"/>
      <LeftSection className="w-1/2 bg-background2"/>
      <RightSection className="w-full bg-background2"/>
    </main>
  )
}
