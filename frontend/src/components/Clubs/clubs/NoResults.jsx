const NoResults = () => {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-2xl font-semibold text-gray-700 mb-2">No clubs found</h3>
      <p className="text-gray-500">Try adjusting your search terms or filters</p>
    </div>
  );
};

export default NoResults;