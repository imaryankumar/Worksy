"use client";
import EmployeCard from "@/components/EmployeCard";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/lib/axiosInstance";
import { restoreUser } from "@/store/slices/authSlice/getAuthSlice";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const Overview = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  const fetchEmployees = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await axiosInstance.get(
        `/api/v1/employee?search=${debouncedSearch}&offset=${pageParam}&limit=10`
      );
      if (!data.success) {
        toast.error(data.message || "Failed to fetch employees");
        throw new Error(data.message);
      }
      return data;
    },
    [debouncedSearch]
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["employees", debouncedSearch],
    queryFn: fetchEmployees,
    getNextPageParam: (lastPage, pages) => {
      const currentOffset = (pages.length - 1) * 10;
      return lastPage.pagination?.hasMore ? currentOffset + 10 : undefined;
    },
    staleTime: 300000,
    enabled: !!user,
  });

  const { allEmployees, totalCount } = useMemo(
    () => ({
      allEmployees: data?.pages?.flatMap((page) => page.employees) || [],
      totalCount: data?.pages?.[0]?.totalCount || {
        total: 0,
        male: 0,
        female: 0,
        latest: 0,
      },
    }),
    [data]
  );

  const isAdmin = user?.role === "Admin";

  return (
    <div className="w-full h-full flex flex-col gap-8 px-2">
      {/* Welcome Section */}
      <p className="text-2xl sm:text-3xl md:text-4xl font-normal">
        Hi, <span className="font-semibold text-cyan-700">{user?.name}</span>!
        Welcome to{" "}
        <span className="font-semibold text-cyan-700">{user?.companyName}</span>
      </p>

      {/* Stats Card */}
      <EmployeCard userCount={totalCount} />

      {/* Header with Search */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Team Members</h2>
        <div className="flex items-center gap-4">
          {/* Add Employee Button */}
          {isAdmin && (
            <Button className="bg-black text-white">
              <Plus size={16} />
              Add Employee
            </Button>
          )}
          {/* Search Input */}
          <div className="flex w-80 items-center px-3 py-2 border rounded-md shadow-sm">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent outline-none"
              placeholder="Search employees..."
            />
            <Search size={20} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 pr-2">
        <ProfileCard
          isLoading={isLoading}
          isError={isError}
          data={{ employees: allEmployees, totalCount }}
        />

        {/* Load More Button */}
        {hasNextPage && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={fetchNextPage}
              disabled={isFetchingNextPage}
              variant="outline"
              size="lg"
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}

        {/* No More Data */}
        {!hasNextPage && allEmployees.length > 0 && (
          <p className="text-center text-gray-500 mt-10">
            You've reached the end
          </p>
        )}
      </div>
    </div>
  );
};

export default Overview;
