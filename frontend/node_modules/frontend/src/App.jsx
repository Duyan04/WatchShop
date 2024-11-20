import { Carousel } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import banner1 from "./assets/images/banner-home-1.png";
import banner2 from "./assets/images/banner-home-2.png";
import banner3 from "./assets/images/banner-home-3.png";
import banner4 from "./assets/images/banner-home-4.png";
import banner5 from "./assets/images/banner-home-5.png";
import banner6 from "./assets/images/banner-home-6.png";
import banner7 from "./assets/images/banner-home-7.png";
import banner8 from "./assets/images/banner-home-8.png";
import banner9 from "./assets/images/banner-home-9.png";
import banner10 from "./assets/images/banner-home-10.png";
import banner11 from "./assets/images/banner-home-11.png";
import banner12 from "./assets/images/banner-home-12.png";

import { readCategory, readProduct } from "./services/api";

function App() {
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const [itemOffset, setItemOffset] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    readProduct().then((res) => setProducts(res.data));
    readCategory().then((res) => setCategories(res.data));
  }, []);

  const itemsPerPage = 15;
  const endOffset = itemOffset + itemsPerPage;
  const arrFilter = products
    ?.filter((x) => x && (filter === "" || x.category === filter))
    .sort((a, b) => b.id - a.id);
  const currentItems = arrFilter?.slice(itemOffset, endOffset);
  const pageCount =
    Math.ceil(
      arrFilter?.filter((x) => x && (filter === "" || x.category === filter))
        .length / itemsPerPage
    ) || 1;

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % arrFilter.length;
    setItemOffset(newOffset);
  };

  function handleFilter(x) {
    navigate(`/?type=${x.name}`);
    setFilter(x.id);
  }

  function getPriceShow(x) {
    const prices = x.productDetails
      ?.map((pd) => pd.price)
      ?.sort((a, b) => a - b);
    return prices[0] === prices[prices.length - 1]
      ? prices[0]
      : `${prices[0]} - ${prices[prices.length - 1]}`;
  }

  return (
    <div className="mb-10">
      <div className="h-56 sm:h-64 xl:h-96">
        <Carousel>
          <img src={banner1} alt="banner1" />
          <img src={banner2} alt="banner2" />
          <img src={banner3} alt="banner3" />
          <img src={banner4} alt="banner4" />
          <img src={banner5} alt="banner5" />
          <img src={banner6} alt="banner6" />
          <img src={banner7} alt="banner7" />
          <img src={banner8} alt="banner8" />
          <img src={banner9} alt="banner9" />
          <img src={banner10} alt="banner10" />
          <img src={banner11} alt="banner11" />
          <img src={banner12} alt="banner12" />
        </Carousel>
      </div>
      <div className="mt-10 product flex flex-col lg:flex-row lg:gap-8 px-4 lg:px-8">
        <div className="product__category w-full lg:w-1/6 mb-8 lg:mb-0">
          <aside className="w-full" aria-label="Sidebar">
            <div className="px-3 py-4 rounded bg-gray-50 dark:bg-gray-800 shadow-lg">
              <div className="space-y-2 font-bold border-b border-black pb-2 text-lg text-center">
                Filter by Category
              </div>
              <ul
                className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700 overflow-y-auto"
                style={{ maxHeight: 300 }}
              >
                <li>
                  <button
                    onClick={() => {
                      setFilter("");
                      navigate("/");
                    }}
                    className="block p-2 text-left w-full hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition duration-200"
                  >
                    <span className="ml-3">All products</span>
                  </button>
                </li>
                {categories?.map((x) => (
                  <li key={x.id}>
                    <button
                      onClick={() => handleFilter(x)}
                      className="block p-2 text-left w-full hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition duration-200"
                    >
                      <span className="ml-3">{x.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
        <div className="product__list w-full lg:w-5/6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentItems?.map((x) => (
            <div
              key={x.id}
              className="item bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-1 hover:scale-105"
            >
              <div
                className="image h-72 overflow-hidden cursor-pointer"
                onClick={() => {
                  navigate(`/product/${x.id}/${x.name}`);
                }}
              >
                <img
                  className="rounded-t-lg w-full h-full object-cover"
                  src={x.image}
                  alt={x.name}
                />
              </div>
              <div className="px-5 pb-5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-italic">US$ {getPriceShow(x)}</span>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    navigate(`/product/${x.id}/${x.name}`);
                  }}
                >
                  <h5 className="text-lg font-semibold">{x.name}</h5>
                </div>
              </div>
            </div>
          ))}
          <div className="col-span-full w-full">
            <ReactPaginate
              breakLabel="..."
              nextLabel=">> Next"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={isNaN(pageCount) ? 1 : pageCount}
              previousLabel="Prev <<"
              renderOnZeroPageCount={null}
              containerClassName="pagination flex justify-center mt-4"
              pageLinkClassName="page-num px-3 py-1 border rounded text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-white transition duration-200"
              previousLinkClassName="page-num px-3 py-1 border rounded text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-white transition duration-200"
              nextLinkClassName="page-num px-3 py-1 border rounded text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-white transition duration-200"
              activeLinkClassName="active-num bg-yellow-500 text-white border-yellow-500"
            />

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
