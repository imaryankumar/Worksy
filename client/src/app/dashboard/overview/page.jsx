import EmployeCard from "@/components/EmployeCard";

const Overview = () => {
  return (
    <div className="w-full h-full flex flex-col gap-8 px-2">
      <p className="text-2xl sm:text-3xl md:text-4xl font-normal w-full">
        Hi, <span className="font-semibold text-blue-700">Aryan Kumar</span>!
        Welcome to <span className="font-semibold text-blue-700">EZ Works</span>
      </p>
      <EmployeCard userCount={0} />
      <div className="w-full h-72 md:h-96 lg:h-[30rem] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
        <h1 className="text-lg md:text-xl font-medium">
          Welcome to Dashboard !!
        </h1>
      </div>
    </div>
  );
};

export default Overview;
