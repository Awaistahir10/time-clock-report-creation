const parseDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const getWeekOfMonth = (dateStr) => {
    const date = parseDate(dateStr);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDay.getDay() || 7; // Ensure Sunday is 7, not 0
    const dayOfMonth = date.getDate();

    // Calculate the week number
    return Math.ceil((dayOfMonth + firstDayOfWeek - 1) / 7);
};