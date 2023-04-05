const getTotalPageNumber = (total) => {
    const limit = import.meta.env.VITE_LIMIT_PER_PAGE;
    const totalPageNumber = Math.ceil(total / limit);
    return totalPageNumber;
};

export default getTotalPageNumber;
