import logo2 from "../../assets/logo2.png";
import logo from "../../assets/logo.png";

export default function Header() {
  return (
    <div className="flex justify-between items-center bg-[--main] p-4 lg:px-10 h-[66px]">
    <div className="flex items-center space-x-2">
      <img className="h-12" src={logo} alt="" />
      <span className="hidden sm:inline  text-white font-bold text-3xl font-roboto">BetPay new</span>
    </div>
    <div className="text-white font-bold text-3xl font-roboto sm:hidden">
      BetPay
    </div>
    <div>
      <img className="h-12" src={logo2} alt="" />
    </div>
  </div>
  
  
  );
}
