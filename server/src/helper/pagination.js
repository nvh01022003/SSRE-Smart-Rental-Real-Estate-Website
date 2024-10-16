const pagination = (objectPagination, query, totalData) => {
    const numberPage = parseInt(query.page);
    if (isNaN(numberPage) == false) {
        objectPagination.currentPage = numberPage;
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitPage;
    const amountPage = Math.ceil(totalData / objectPagination.limitPage);
    objectPagination.amountPage = amountPage;
    return objectPagination
}
module.exports = { pagination }