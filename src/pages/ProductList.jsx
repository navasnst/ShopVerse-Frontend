
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../Components/ProductCard';
import FilterSidebar from '../Components/FilterSidebar';
import SortDropdown from '../Components/SortDropdown';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pages: 1, limit: 12, total: 0 });
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', brand: '', vendor: '', rating: '', q: '' });
  const [sort, setSort] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const loadProducts = async (opts = {}) => {
    setLoading(true);
    try {
      const { append = false, page = 1 } = opts;
      const params = {
        page,
        limit: pageInfo.limit,
        sort,
        ...filters,
      };

      Object.keys(params).forEach((k) => (params[k] === '' || params[k] === undefined) && delete params[k]);

      const res = await api.get('/products', { params });
      const { products: fetched, pagination } = res.data;

      if (append) setProducts((p) => [...p, ...fetched]);
      else setProducts(fetched);

      setPageInfo(pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts({ append: false, page: 1 });
  }, [filters, sort]);

  const loadMore = () => {
    if (pageInfo.page >= pageInfo.pages) return;
    const next = pageInfo.page + 1;
    loadProducts({ append: true, page: next });
    setPageInfo((p) => ({ ...p, page: next }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-10">

      {/* Mobile filter toggle button */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="px-4 py-2 border rounded-md text-sm"
        >
          Filters
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* Sidebar (Mobile dropdown + Desktop fixed) */}
        <div className="col-span-12 md:col-span-3">
          <div className="md:block hidden sticky top-24">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* Mobile collapsible filter */}
          {showMobileFilter && (
            <div className="md:hidden border rounded-md p-4 mb-4 bg-white shadow">
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>
          )}
        </div>

        {/* Product Section */}
        <div className="col-span-12 md:col-span-9">

          {/* Sorting dropdown */}
          <div className="hidden md:flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {loading && <div>Loading...</div>}

          {/* Responsive product grid */}
          <div className="grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4 
            gap-5"
          >
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 flex justify-center">
            {pageInfo.page < pageInfo.pages ? (
              <button onClick={loadMore} className="btn px-6 py-2 border rounded-md">
                Load more
              </button>
            ) : (
              <p className="text-gray-500 text-sm">No more products</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}








