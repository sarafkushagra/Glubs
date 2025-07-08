const SignInForm = () => {
  return (
   <div className="w-full max-w-md p-8 h-[550px]">
      <h2 className="text-2xl font-bold text-[#3d348b] mt-12 mb-8 text-center">Sign in to KagJaat</h2>
      <div className="flex justify-center gap-4 mb-4">
        <button className="bg-white rounded-full shadow p-3 w-12">f</button>
        <button className="bg-white rounded-full shadow p-3 w-12">G+</button>
        <button className="bg-white rounded-full shadow p-3 w-12">in</button>
      </div>
      <p className="text-center text-sm text-gray-500 mb-4">or use your email account:</p>
      <form className="space-y-5">
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <p className="text-sm text-right text-gray-500 hover:underline cursor-pointer">Forgot your password?</p>
        <button className="bg-[#3d348b] text-white w-full py-2 rounded hover:bg-[#00509d]">SIGN IN</button>
      </form>
    </div>
  );
};

export default SignInForm;
