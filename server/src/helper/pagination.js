const pagination = async (objectPagination, numberPage, totalData) => {
    console.log(totalData)
    if (isNaN(numberPage) == false) {
        objectPagination.currentPage = numberPage;
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitPage;
    console.log(objectPagination.skip)
    const amountPage = Math.ceil(totalData / objectPagination.limitPage);
    objectPagination.amountPage = amountPage;
    return objectPagination
}
module.exports = { pagination }