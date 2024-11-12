import logo2 from "../../assets/logo2.png";
import logo from "../../assets/logo.png";
export default function Header() {
  return (
    <div className="flex justify-between items-center bg-yellow-400 p-4 h-[66px]">
    <div className="ml-10">
      <img className="h-12" src={logo} alt="" />
    </div>
    <div className="text-white font-bold text-3xl mr-auto ml-6 font-roboto">BetPay</div>
    <div className="mr-10">
      <img className="h-12" src={logo2} alt="" />
    </div>
  </div>
  
  );
}



