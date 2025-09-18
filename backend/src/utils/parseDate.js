export const parseDate = (dateString) => {
  if (!dateString) return null;

  if (dateString.includes("-") && dateString.split("-").length === 3) {
    const [day, month, year] = dateString.split("-");
    return new Date(year, month - 1, day);
  }
  return new Date(dateString);
};

export const getMonthRange = (date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59
  );
  return { startOfMonth, endOfMonth };
};

export const isValidDateRange = (selectedDate) => {
  const today = new Date();
  const threeMonthsAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 3,
    today.getDate()
  );
  const threeMonthsAhead = new Date(
    today.getFullYear(),
    today.getMonth() + 3,
    today.getDate()
  );

  return selectedDate >= threeMonthsAgo && selectedDate <= threeMonthsAhead;
};
