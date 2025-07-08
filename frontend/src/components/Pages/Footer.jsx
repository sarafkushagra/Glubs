import React from "react";

function Footer() {
    return (
        <>
         <div className="min-h-screen flex flex-col "> </div>
      <footer className="bg-gradient-to-br from-[#3d348b] to-[#00509d] text-white py-8">
        <div className="container mx-auto px-4">

          <div className="flex mb-8 gap-4 ">
            <div className="w-full md:w-2/6 mb-4 md:mb-0">
              <h1 className="font-semibold text-gray-100 mb-4 text-xl">Glubs</h1>
              <h6 className="md:w-3/4 text-xxl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus totam commodi sunt aliquam minima quis sapiente eius a, similique recusandae laboriosam autem assumenda ex aut.</h6>

              <h3 className="mt-4 mb-4" >Follow us:</h3>
              <div className="flex space-x-3">
                <a
                  href="www.facebook.com"
                  className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition"
                  aria-label="Facebook"
                >
                  FB
                </a>
                <a
                  href="www.twitter.com"
                  className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition"
                  aria-label="Twitter"
                >
                  TW
                </a>
                <a
                  href="www.youtube.com"
                  className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition"
                  aria-label="Youtube"
                >
                  YT
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/6 mb-4 md:mb-0">
              <ul className="space-y-3 text-sm">
                <li><a href="#!" className="hover:text-gray-300">About</a></li>
                <li><a href="#!" className="hover:text-gray-300">About Us</a></li>
                <li><a href="#!" className="hover:text-gray-300">FAQ</a></li>
                <li><a href="#!" className="hover:text-gray-300">Statistics</a></li>
                <li><a href="#!" className="hover:text-gray-300">Resources</a></li>
                <li><a href="#!" className="hover:text-gray-300">Circulars</a></li>
                <li><a href="#!" className="hover:text-gray-300">Sitemap</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/6 mb-4 md:mb-0">
              <ul className="space-y-3 text-sm ">
                <li><a href="#!" className="hover:text-gray-300">Need Help?</a></li>
                <li><a href="#!" className="hover:text-gray-300">Careers</a></li>
                <li><a href="#!" className="hover:text-gray-300">Feedback</a></li>
                <li><a href="#!" className="hover:text-gray-300">Team</a></li>
                <li><a href="#!" className="hover:text-gray-300">MeriPachaan</a></li>
                <li><a href="#!" className="hover:text-gray-300">Discover</a></li>
                <li><a href="#!" className="hover:text-gray-300">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row md:justify-between md:items-center text-sm">
            <p className="mb-2 md:mb-0">
              Last Updated: 08 Apr 2025 | Version: 2.98.0.15
            </p>
            <p className="opacity-75">
              © 2025, Website maintained by National eGovernance Division (NeGD)
            </p>
          </div>
        </div>
      </footer>
     
      
    
        </>
    );
}

export default Footer;
