import logo from "../assets/images/logo-foot.png";
import { Link } from "react-router-dom";

import facebookIcon from "../assets/images/facebook-icon.png";
import instagramIcon from "../assets/images/instagram-icon.png";
import tiktokIcon from "../assets/images/tiktok-icon.png";

function FooterComponent() {
  return (
    <footer className="bg-black text-gray-400">
      <div className="container mx-auto py-8 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center md:items-center">
          <Link to={""}>
            <img
              src={logo}
              alt="logo"
              className="h-40 mb-4"
            />
          </Link>
          <div className="flex space-x-3 w-full justify-center">
            <Link to={""}>
              <img src={facebookIcon} alt="Facebook" className="h-8 w-8" />
            </Link>
            <Link to={""}>
              <img src={instagramIcon} alt="Instagram" className="h-8 w-8" />
            </Link>
            <Link to={""}>
              <img src={tiktokIcon} alt="TikTok" className="h-8 w-8" />
            </Link>
          </div>
        </div>
        <div>
          <h2 className="mb-6 text-sm font-semibold uppercase">Address</h2>
          <iframe
            title="Address"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.3400548870786!2d-122.0011639!3d37.5234805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fbf51099ff33d%3A0x5aa1a3338445da75!2s5904%20Newpark%20Mall%20Rd%2C%20Newark%2C%20CA%2094560%2C%20USA!5e0!3m2!1sen!2s!4v1688219852776!5m2!1sen!2s"
            width="100%"
            height="200"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-md"
          ></iframe>
        </div>
        <div>
          <h2 className="mb-6 text-sm font-semibold uppercase">Support</h2>
          <ul>
            <li className="mb-4">
              <Link to={false} className="hover:underline">
                Order Tracking
              </Link>
            </li>
            <li className="mb-4">
              <Link to={false} className="hover:underline">
                Consumer Service
              </Link>
            </li>
            <li className="mb-4">
              <Link to={"/contact-us"} className="hover:underline">
                Email Our CEO
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-6 text-sm font-semibold uppercase">Programs</h2>
          <ul>
            <li className="mb-4">
              <Link to={false} className="hover:underline">
                Elite Club
              </Link>
            </li>
            <li className="mb-4">
              <Link to={false} className="hover:underline">
                Friend Rewards
              </Link>
            </li>
            <li className="mb-4">
              <Link to={false} className="hover:underline">
                Student Program
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; 2024 Timeless Watches. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to={""} className="hover:text-white">Privacy Policy</Link>
            <Link to={""} className="hover:text-white">Terms of Service</Link>
            <Link to={""} className="hover:text-white">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;
