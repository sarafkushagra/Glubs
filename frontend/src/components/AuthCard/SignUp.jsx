import { HiMiniHome } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
const SignUpForm = () => {

  const navigate = useNavigate();
  return (
    <>
      <div className="w-full bg-white p-8 h-[550px]">
        <div onClick={() => navigate("/")} className="cursor-pointer text-3xl">
          <HiMiniHome className="text-3xl" />
        </div>
        <div className="w-full ml-8 max-w-md">

          <h2 className="text-2xl font-bold text-[#3d348b] mt-12 mb-4 text-center">Create Account</h2>
          <div className="flex justify-center gap-4 mb-4">
            <button className="bg-white rounded-full shadow p-3 w-12">f</button>
            <button className="bg-white rounded-full shadow p-3 w-12">G+</button>
            <button className="bg-white rounded-full shadow p-3 w-12">in</button>
          </div>
          <p className="text-center text-sm text-gray-500 mb-4">or use your email for registration:</p>
          <form className="space-y-5">
            <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
            <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
            <input type="password" placeholder="Password" className="w-full p-2 border rounded" />
            <button className="bg-[#3d348b] text-white w-full py-2 rounded hover:bg-[#00509d]">SIGN UP</button>
          </form>
        </div>

      </div>
    </>
  );
};

export default SignUpForm;
