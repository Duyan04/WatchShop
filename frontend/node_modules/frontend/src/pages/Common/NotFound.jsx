import { Result } from "antd";
import { Link } from "react-router-dom";
import background from "../../assets/images/watch-background-3.jpg";

function NotFound() {
  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '750px' }}
    >
      <div className="bg-white bg-opacity-90 p-10 rounded-lg shadow-lg text-center transform transition duration-500 hover:scale-105">
        <Result
          status="404"
          title={<span className="text-4xl font-bold text-gray-800">404</span>}
          subTitle={<span className="text-lg text-gray-600">Sorry, the page you visited does not exist.</span>}
          extra={
            <div className="mt-4">
              <Link
                to="/"
                className="text-yellow-500 hover:underline text-lg font-semibold"
              >
                Back Home
              </Link>
            </div>
          }
        />
      </div>
    </div>
  );
}

NotFound.displayName = "notfound"; // Đặt tên cho component

export default NotFound;
